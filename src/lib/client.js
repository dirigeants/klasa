const Discord = require('discord.js');
const path = require('path');
const now = require('performance-now');
const CommandMessage = require('./structures/commandMessage');
const ArgResolver = require('./parsers/ArgResolver');
const PermLevels = require('./structures/PermissionLevels');
const util = require('./util/util');
const SettingGateway = require('./settings/settingGateway');
const CommandStore = require('./structures/CommandStore');
const InhibitorStore = require('./structures/InhibitorStore');
const FinalizerStore = require('./structures/FinalizerStore');
const MonitorStore = require('./structures/MonitorStore');
const LanguageStore = require('./structures/LanguageStore');
const ProviderStore = require('./structures/ProviderStore');
const EventStore = require('./structures/EventStore');
const ExtendableStore = require('./structures/ExtendableStore');

/**
 * The client for handling everything. See {@tutorial GettingStarted} for more information how to get started using this class.
 * @extends external:Client
 * @tutorial GettingStarted
 */
class KlasaClient extends Discord.Client {

	/**
	 * @typedef {Object} KlasaClientConfig
	 * @memberof KlasaClient
	 * @property {DiscordJSConfig} clientOptions The options to pass to D.JS
	 * @property {string} prefix The default prefix the bot should respond to
	 * @property {PermissionLevels} permLevels The permission levels to use with this bot
	 * @property {string} [clientBaseDir=process.cwd()] The directory where all piece folders can be found
	 * @property {number} [commandMessageLifetime=1800] The threshold for how old command messages can be before sweeping since the last edit in seconds
	 * @property {number} [commandMessageSweep=900] The interval duration for which command messages should be sweept in seconds
	 * @property {object} [provider] The provider to use in Klasa
	 * @property {boolean} [disableLogTimestamps=false] Whether or not to disable the log timestamps
	 * @property {boolean} [disableLogColor=false] Whether or not to disable the log colors
	 * @property {boolean} [ignoreBots=true] Whether or not this bot should ignore other bots
	 * @property {boolean} [ignoreSelf=true] Whether or not this bot should ignore itself
	 * @property {RegExp} [prefixMention] The prefix mention for your bot (Automatically Generated)
	 * @property {boolean} [cmdPrompt=false] Whether the bot should prompt missing parameters
	 * @property {boolean} [cmdEditing=false] Whether the bot should update responses if the command is edited
	 * @property {string} [ownerID] The discord user id for the user the bot should respect as the owner (gotten from Discord api if not provided)
	 */

	/**
	 * @param {KlasaClientConfig} config The config to pass to the new client
	 */
	constructor(config = {}) {
		if (typeof config !== 'object') throw new TypeError('Configuration for Klasa must be an object.');
		super(config.clientOptions);

		/**
		 * The config passed to the new Klasa.Client
		 * @type {KlasaClientConfig}
		 */
		this.config = config;
		this.config.provider = config.provider || {};
		this.config.language = config.language || 'en-US';

		/**
		 * The directory to the node_modules folder where Klasa exists
		 * @type {string}
		 */
		this.coreBaseDir = path.join(__dirname, '../');

		/**
		 * The directory where the user files are at
		 * @type {string}
		 */
		this.clientBaseDir = config.clientBaseDir || process.cwd();

		/**
		 * The argument resolver
		 * @type {ArgResolver}
		 */
		this.argResolver = new ArgResolver(this);

		/**
		 * The cache where commands are stored
		 * @type {CommandStore}
		 */
		this.commands = new CommandStore(this);

		/**
		 * The cache where inhibitors are stored
		 * @type {InhibitorStore}
		 */
		this.inhibitors = new InhibitorStore(this);

		/**
		 * The cache where finalizers are stored
		 * @type {FinalizerStore}
		 */
		this.finalizers = new FinalizerStore(this);

		/**
		 * The cache where monitors are stored
		 * @type {MonitorStore}
		 */
		this.monitors = new MonitorStore(this);

		/**
		 * The cache where languages are stored
		 * @type {LanguageStore}
		 */
		this.languages = new LanguageStore(this);

		/**
		 * The cache where providers are stored
		 * @type {ProviderStore}
		 */
		this.providers = new ProviderStore(this);

		/**
		 * The cache where events are stored
		 * @type {EventStore}
		 */
		this.events = new EventStore(this);

		/**
		 * The cache where extendables are stored
		 * @type {ExtendableStore}
		 */
		this.extendables = new ExtendableStore(this);

		/**
		 * The cache of command messages and responses to be used for command editing
		 * @type {external:Collection}
		 */
		this.commandMessages = new Discord.Collection();

		/**
		 * The permissions structure for this bot
		 * @type {PermissionLevels}
		 */
		this.permLevels = this.validatePermLevels();

		/**
		 * The threshold for how old command messages can be before sweeping since the last edit in seconds
		 * @type {number}
		 */
		this.commandMessageLifetime = config.commandMessageLifetime || 1800;

		/**
		 * The interval duration for which command messages should be sweept in seconds
		 * @type {number}
		 */
		this.commandMessageSweep = config.commandMessageSweep || 900;

		/**
		 * Whether the client is truely ready or not
		 * @type {boolean}
		 */
		this.ready = false;

		/**
		 * Additional methods to be used elsewhere in the bot
		 * @type {object}
		 * @property {class} Collection A discord.js collection
		 * @property {class} Embed A discord.js Message Embed
		 * @property {class} MessageCollector A discord.js MessageCollector
		 * @property {class} Webhook A discord.js WebhookClient
		 * @property {function} escapeMarkdown A discord.js escape markdown function
		 * @property {function} splitMessage A discord.js split message function
		 * @property {class} CommandMessage A command message
		 * @property {Util} util A collection of static methods to be used thoughout the bot
		 */
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

		/**
		 * The settings gateway instance
		 * @type {SettingGateway}
		 */
		this.settingGateway = new SettingGateway(this);

		/**
		 * The application info cached from the discord api
		 * @type {object}
		 */
		this.application = null;

		this.once('ready', this._ready.bind(this));
	}

	/**
	 * The invite link for the bot
	 * @readonly
	 * @returns {string}
	 */
	get invite() {
		if (!this.user.bot) throw 'Why would you need an invite link for a selfbot...';
		const permissions = Discord.Permissions.resolve([...new Set(this.commands.reduce((a, b) => a.concat(b.botPerms), ['READ_MESSAGES', 'SEND_MESSAGES']))]);
		return `https://discordapp.com/oauth2/authorize?client_id=${this.application.id}&permissions=${permissions}&scope=bot`;
	}

	/**
	 * Validates the permission structure passed to the client
	 * @private
	 * @returns {PermissionLevels}
	 */
	validatePermLevels() {
		const permLevels = this.config.permsLevels || KlasaClient.defaultPermLevels;
		if (!(permLevels instanceof PermLevels)) throw new Error('permLevels must be an instance of the PermissionLevels class');
		if (permLevels.isValid()) return permLevels;
		throw new Error(permLevels.debug());
	}

	/**
	 * Use this to login to Discord with your bot
	 * @param {string} token Your bot token
	 */
	async login(token) {
		const start = now();
		const [[commands, aliases], inhibitors, finalizers, events, monitors, languages, providers, extendables] = await Promise.all([
			this.commands.loadAll(),
			this.inhibitors.loadAll(),
			this.finalizers.loadAll(),
			this.events.loadAll(),
			this.monitors.loadAll(),
			this.languages.loadAll(),
			this.providers.loadAll(),
			this.extendables.loadAll()
		]).catch((err) => {
			console.error(err);
			process.exit();
		});
		this.emit('log', [
			`Loaded ${commands} commands, with ${aliases} aliases.`,
			`Loaded ${inhibitors} command inhibitors.`,
			`Loaded ${finalizers} command finalizers.`,
			`Loaded ${monitors} message monitors.`,
			`Loaded ${languages} languages.`,
			`Loaded ${providers} providers.`,
			`Loaded ${events} events.`,
			`Loaded ${extendables} extendables.`
		].join('\n'));
		this.emit('log', `Loaded in ${(now() - start).toFixed(2)}ms.`);
		super.login(token);
	}

	/**
	 * The owner for this bot
	 * @readonly
	 * @type {external:User}
	 */
	get owner() {
		return this.users.get(this.config.ownerID);
	}

	/**
	 * The schema manager for this bot
	 * @readonly
	 * @type {SchemaManager}
	 */
	get schemaManager() {
		return this.settingGateway.schemaManager;
	}

	/**
	 * The once ready function for the client to init all pieces
	 * @private
	 */
	async _ready() {
		this.config.prefixMention = new RegExp(`^<@!?${this.user.id}>`);
		if (this.config.ignoreBots === undefined) this.config.ignoreBots = true;
		if (this.config.ignoreSelf === undefined) this.config.ignoreSelf = this.user.bot;
		if (this.user.bot) this.application = await super.fetchApplication();
		if (!this.config.ownerID) this.config.ownerID = this.user.bot ? this.application.owner.id : this.user.id;
		await this.providers.init();
		await this.settingGateway.init();
		await this.commands.init();
		await this.inhibitors.init();
		await this.finalizers.init();
		await this.monitors.init();
		util.initClean(this);
		this.setInterval(this.sweepCommandMessages.bind(this), this.commandMessageSweep * 1000);
		this.ready = true;
		this.emit('log', this.config.readyMessage || `Successfully initialized. Ready to serve ${this.guilds.size} guilds.`);
	}

	/**
	 * Sweeps command messages based on the lifetime parameter
	 * @param {number} lifetime The threshold for how old command messages can be before sweeping since the last edit in seconds
	 * @returns {number} The amount of messages swept
	 */
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

}

/**
 * The default PermLevels
 * @type {PermissionLevels}
 */
KlasaClient.defaultPermLevels = new PermLevels()
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
	.addLevel(4, false, (client, msg) => msg.guild && msg.author === msg.guild.owner)
	.addLevel(9, true, (client, msg) => msg.author === client.owner)
	.addLevel(10, false, (client, msg) => msg.author === client.owner);

process.on('unhandledRejection', (err) => {
	if (!err) return;
	console.error(`Uncaught Promise Error: \n${err.stack || err}`);
});

module.exports = KlasaClient;
