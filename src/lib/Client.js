const Discord = require('discord.js');
const path = require('path');
const now = require('performance-now');
const CommandMessage = require('./structures/CommandMessage');
const ArgResolver = require('./parsers/ArgResolver');
const PermLevels = require('./structures/PermissionLevels');
const util = require('./util/util');
const Settings = require('./settings/SettingsCache');
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
	 * @property {string} prefix The default prefix the bot should respond to
	 * @property {DiscordJSConfig} [clientOptions={}] The options to pass to D.JS
	 * @property {PermissionLevels} [permissionLevels=KlasaClient.defaultPermissionLevels] The permission levels to use with this bot
	 * @property {string} [clientBaseDir=path.dirname(require.main.filename)] The directory where all piece folders can be found
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
	 * @property {boolean} [typing=false] Whether the bot should type while processing commands.
	 * @property {boolean} [quotedStringSupport=false] Whether the bot should default to using quoted string support in arg parsing, or not (overridable per command)
	 * @property {?(string|Function)} [readyMessage=`Successfully initialized. Ready to serve ${this.guilds.size} guilds.`] readyMessage to be passed thru Klasa's ready event
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
		this.clientBaseDir = config.clientBaseDir || path.dirname(require.main.filename);

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
		 * A Store registry
		 * @type {external:Collection}
		 */
		this.pieceStores = new Discord.Collection();

		/**
		 * The cache of command messages and responses to be used for command editing
		 * @type {external:Collection}
		 */
		this.commandMessages = new Discord.Collection();

		/**
		 * The permissions structure for this bot
		 * @type {PermissionLevels}
		 */
		this.permissionLevels = this.validatePermissionLevels();

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
		 * The object where the gateways are stored settings
		 * @type {Object}
		 */
		this.settings = null;

		/**
		 * The application info cached from the discord api
		 * @type {object}
		 */
		this.application = null;

		this.registerStore(this.commands)
			.registerStore(this.inhibitors)
			.registerStore(this.finalizers)
			.registerStore(this.monitors)
			.registerStore(this.languages)
			.registerStore(this.providers)
			.registerStore(this.events)
			.registerStore(this.extendables);
		// Core pieces already have argresolver entries for the purposes of documentation.

		this.once('ready', this._ready.bind(this));
	}

	/**
	 * The invite link for the bot
	 * @readonly
	 * @returns {string}
	 */
	get invite() {
		if (!this.user.bot) throw 'Why would you need an invite link for a selfbot...';
		const permissions = Discord.Permissions.resolve([...new Set(this.commands.reduce((a, b) => a.concat(b.botPerms), ['VIEW_CHANNEL', 'SEND_MESSAGES']))]);
		return `https://discordapp.com/oauth2/authorize?client_id=${this.application.id}&permissions=${permissions}&scope=bot`;
	}

	/**
	 * Validates the permission structure passed to the client
	 * @private
	 * @returns {PermissionLevels}
	 */
	validatePermissionLevels() {
		const permLevels = this.config.permissionLevels || KlasaClient.defaultPermissionLevels;
		if (!(permLevels instanceof PermLevels)) throw new Error('permissionLevels must be an instance of the PermissionLevels class');
		if (permLevels.isValid()) return permLevels;
		throw new Error(permLevels.debug());
	}

	/**
	 * Registers a custom store to the client
	 * @param {Store} store The store that pieces will be stored in.
	 * @returns {KlasaClient} this client
	 */
	registerStore(store) {
		this.pieceStores.set(store.name, store);
		return this;
	}

	/**
	 * Unregisters a custom store from the client
	 * @param {Store} storeName The store that pieces will be stored in.
	 * @returns {KlasaClient} this client
	 */
	unregisterStore(storeName) {
		this.pieceStores.delete(storeName);
		return this;
	}

	/**
	 * Registers a custom piece to the client
	 * @param {string} pieceName The name of the piece, if you want to register an arg resolver for this piece
	 * @param {Store} store The store that pieces will be stored in.
	 * @returns {KlasaClient} this client
	 */
	registerPiece(pieceName, store) {
		// eslint-disable-next-line func-names
		this.argResolver.prototype[pieceName] = async function (arg, currentUsage, possible, repeat, msg) {
			const piece = store.get(arg);
			if (piece) return piece;
			if (currentUsage.type === 'optional' && !repeat) return null;
			throw msg.language.get('RESOLVER_INVALID_PIECE', currentUsage.possibles[possible].name, pieceName);
		};
		return this;
	}

	/**
	 * Unregisters a custom piece from the client
	 * @param {string} pieceName The name of the piece
	 * @returns {KlasaClient} this client
	 */
	unregisterPiece(pieceName) {
		delete this.argResolver.prototype[pieceName];
		return this;
	}

	/**
	 * Use this to login to Discord with your bot
	 * @param {string} token Your bot token
	 */
	async login(token) {
		const start = now();
		const loaded = await Promise.all(this.pieceStores.map(async store => `Loaded ${await store.loadAll()} ${store.name}.`))
			.catch((err) => {
				console.error(err);
				process.exit();
			});
		this.emit('log', loaded.join('\n'));
		this.settings = new Settings(this);
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
		await this.settings.guilds.init();
		// Providers must be init before settings, and those before all other stores.
		await Promise.all(this.pieceStores.filter(store => store.name !== 'providers').map(store => store.init()));
		util.initClean(this);
		this.setInterval(this.sweepCommandMessages.bind(this), this.commandMessageSweep * 1000);
		this.ready = true;
		if (this.config.readyMessage === undefined) this.emit('log', `Successfully initialized. Ready to serve ${this.guilds.size} guilds.`)
		else if (this.config.readyMessage !== null) this.emit('log', typeof this.config.readyMessage === "function" ? this.config.readyMessage(this) : this.config.readyMessage);
		this.emit('klasaReady');
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
 * The default PermissionLevels
 * @type {PermissionLevels}
 */
KlasaClient.defaultPermissionLevels = new PermLevels()
	.addLevel(0, false, () => true)
	.addLevel(6, false, (client, msg) => msg.guild && msg.member.permissions.has('MANAGE_GUILD'))
	.addLevel(7, false, (client, msg) => msg.guild && msg.member === msg.guild.owner)
	.addLevel(9, true, (client, msg) => msg.author === client.owner)
	.addLevel(10, false, (client, msg) => msg.author === client.owner);


/**
 * Emitted when klasa is fully ready and initialized.
 * @event KlasaClient#klasaReady
 */

/**
 * A central logging event for klasa.
 * @event KlasaClient#log
 * @param {(string|Object)} data The data to log
 * @param {string} [type='log'] The type of log: 'log', 'debug', 'warn', or 'error'.
 */

/**
 * Emitted when a command has been inhibited.
 * @event KlasaClient#commandInhibited
 * @param {external:Message} message The message that triggered the command
 * @param {Command} command The command triggered
 * @param {?string} response The reason why it was inhibited if not silent
 */

/**
 * Emitted when a command has been run.
 * @event KlasaClient#commandRun
 * @param {CommandMessageProxy} message The message that triggered the command
 * @param {Command} command The command run
 * @param {any[]} params The resolved parameters of the command
 * @param {?any} response Usually a response message, but whatever the command returned.
 */

/**
 * Emitted when a command has errored.
 * @event KlasaClient#commandError
 * @param {CommandMessageProxy} message The message that triggered the command
 * @param {Command} command The command run
 * @param {any[]} params The resolved parameters of the command
 * @param {(string|Object)} error The command error
 */

/**
 * Emitted when {@link SettingGateway.update}, {@link SettingGateway.updateArray} or {@link SettingGateway.reset} is run.
 * @event KlasaClient#settingUpdate
 * @param {SettingGateway} gateway The setting gateway with the updated setting
 * @param {string} id The identifier of the gateway that was updated
 * @param {Object} oldEntries The old settings entries
 * @param {Object} newEntries The new settings entries
 */

process.on('unhandledRejection', (err) => {
	if (!err) return;
	console.error(`Uncaught Promise Error: \n${err.stack || err}`);
});

module.exports = KlasaClient;
