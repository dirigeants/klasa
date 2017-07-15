const Discord = require('discord.js');
const path = require('path');
const now = require('performance-now');
const CommandMessage = require('./structures/commandMessage');
const ArgResolver = require('./parsers/argResolver');
const PermLevels = require('./util/permLevels');
const util = require('./util/util');
const SettingGateway = require('./settings/settingGateway');
const CommandStore = require('./stores/CommandStore');
const InhibitorStore = require('./stores/InhibitorStore');
const FinalizerStore = require('./stores/FinalizerStore');
const MonitorStore = require('./stores/MonitorStore');
const ProviderStore = require('./stores/ProviderStore');
const EventStore = require('./stores/EventStore');
const ExtendableStore = require('./stores/ExtendableStore');

module.exports = class Klasa extends Discord.Client {

	constructor(config = {}) {
		if (typeof config !== 'object') throw new TypeError('Configuration for Klasa must be an object.');
		super(config.clientOptions);
		this.config = config;
		this.config.provider = config.provider || {};
		this.coreBaseDir = path.join(__dirname, '../');
		this.clientBaseDir = process.cwd();
		this.argResolver = new ArgResolver(this);
		this.commands = new CommandStore(this);
		this.inhibitors = new InhibitorStore(this);
		this.finalizers = new FinalizerStore(this);
		this.monitors = new MonitorStore(this);
		this.providers = new ProviderStore(this);
		this.events = new EventStore(this);
		this.extendables = new ExtendableStore(this);
		this.commandMessages = new Discord.Collection();
		this.permStructure = this.validatePermStructure();
		this.commandMessageLifetime = config.commandMessageLifetime || 1800;
		this.commandMessageSweep = config.commandMessageSweep || 900;
		this.ready = false;
		this.methods = {
			Collection: Discord.Collection,
			Embed: Discord.MessageEmbed,
			MessageCollector: Discord.MessageCollector,
			Webhook: Discord.WebhookClient,
			escapeMarkdown: Discord.escapeMarkdown,
			splitMessage: Discord.splitMessage,
			CommandMessage,
			util
		};
		this.settingGateway = new SettingGateway(this);
		this.application = null;
		this.once('ready', this._ready.bind(this));
	}

	get invite() {
		if (!this.user.bot) throw 'Why would you need an invite link for a selfbot...';
		const permissions = Discord.Permissions.resolve([...new Set(this.commands.reduce((a, b) => a.concat(b.conf.botPerms), ['READ_MESSAGES', 'SEND_MESSAGES']))]);
		return `https://discordapp.com/oauth2/authorize?client_id=${this.application.id}&permissions=${permissions}&scope=bot`;
	}

	validatePermStructure() {
		const defaultPermStructure = new PermLevels()
			.addLevel(0, false, () => true)
			.addLevel(2, false, (client, msg) => {
				if (!msg.guild || !msg.guild.settings.modRole) return false;
				const modRole = msg.guild.roles.get(msg.guild.settings.modRole);
				return modRole && msg.member.roles.has(modRole.id);
			})
			.addLevel(3, false, (client, msg) => {
				if (!msg.guild || !msg.guild.settings.adminRole) return false;
				const adminRole = msg.guild.roles.get(msg.guild.settings.adminRole);
				return adminRole && msg.member.roles.has(adminRole.id);
			})
			.addLevel(4, false, (client, msg) => msg.guild && msg.author.id === msg.guild.owner.id)
			.addLevel(9, true, (client, msg) => msg.author.id === client.config.ownerID)
			.addLevel(10, false, (client, msg) => msg.author.id === client.config.ownerID);

		const structure = this.config.permStructure instanceof PermLevels ? this.config.permStructure.structure : null;
		const permStructure = structure || this.config.permStructure || defaultPermStructure.structure;
		if (!Array.isArray(permStructure)) throw 'PermStructure must be an array.';
		if (permStructure.some(perm => typeof perm !== 'object' || typeof perm.check !== 'function' || typeof perm.break !== 'boolean')) {
			throw 'Perms must be an object with a check function and a break boolean.';
		}
		if (permStructure.length !== 11) throw 'Permissions 0-10 must all be defined.';
		return permStructure;
	}

	async login(token) {
		const start = now();
		const [[commands, aliases], inhibitors, finalizers, events, monitors, providers, extendables] = await Promise.all([
			this.commands.loadAll(),
			this.inhibitors.loadAll(),
			this.finalizers.loadAll(),
			this.events.loadAll(),
			this.monitors.loadAll(),
			this.providers.loadAll(),
			this.extendables.loadAll()
		]).catch((err) => {
			console.error(err);
			process.exit();
		});
		this.client.emit('log', [
			`Loaded ${commands} commands, with ${aliases} aliases.`,
			`Loaded ${inhibitors} command inhibitors.`,
			`Loaded ${finalizers} command finalizers.`,
			`Loaded ${monitors} message monitors.`,
			`Loaded ${providers} providers.`,
			`Loaded ${events} events.`,
			`Loaded ${extendables} extendables.`
		].join('\n'));
		this.emit('log', `Loaded in ${(now() - start).toFixed(2)}ms.`);
		super.login(token);
	}

	get schemaManager() {
		return this.settingGateway.schemaManager;
	}

	async _ready() {
		this.config.prefixMention = new RegExp(`^<@!?${this.user.id}>`);
		if (this.user.bot) this.application = await super.fetchApplication();
		if (!this.config.ownerID) this.config.ownerID = this.user.bot ? this.application.owner.id : this.user.id;
		await this.providers.init();
		await this.settingGateway.init();
		await this.commands.init();
		await this.inhibitors.init();
		await this.finalizers.init();
		await this.monitors.init();
		util.initClean(this);
		this.setInterval(this.sweepCommandMessages.bind(this), this.commandMessageLifetime);
		this.ready = true;
		this.emit('log', this.config.readyMessage || `Successfully initialized. Ready to serve ${this.guilds.size} guilds.`);
	}

	sweepCommandMessages(lifetime = this.commandMessageLifetime) {
		if (typeof lifetime !== 'number' || isNaN(lifetime)) throw new TypeError('The lifetime must be a number.');
		if (lifetime <= 0) {
			this.emit('debug', "Didn't sweep messages - lifetime is unlimited");
			return -1;
		}

		const lifetimeMs = lifetime * 1000;
		const rightNow = Date.now();
		const messages = this.commandMessages.size;

		for (const [key, message] of this.commandMessages) {
			if (rightNow - (message.trigger.editedTimestamp || message.trigger.createdTimestamp) > lifetimeMs) this.commandMessages.delete(key);
		}

		this.emit('debug', `Swept ${messages - this.commandMessages.size} commandMessages older than ${lifetime} seconds.`);
		return messages - this.commandMessages.size;
	}

};

process.on('unhandledRejection', (err) => {
	if (!err) return;
	console.error(`Uncaught Promise Error: \n${err.stack || err}`);
});
