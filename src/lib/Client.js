const Discord = require('discord.js');
const path = require('path');
const ArgResolver = require('./parsers/ArgResolver');
const PermLevels = require('./structures/PermissionLevels');
const util = require('./util/util');
const Stopwatch = require('./util/Stopwatch');
const Console = require('./util/Console');
const GatewayDriver = require('./settings/GatewayDriver');
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
	 * @property {string} [prefix] The default prefix the bot should respond to
	 * @property {DiscordJSConfig} [clientOptions={}] The options to pass to D.JS
	 * @property {PermissionLevels} [permissionLevels=KlasaClient.defaultPermissionLevels] The permission levels to use with this bot
	 * @property {string} [clientBaseDir=path.dirname(require.main.filename)] The directory where all piece folders can be found
	 * @property {number} [commandMessageLifetime=1800] The threshold for how old command messages can be before sweeping since the last edit in seconds
	 * @property {object} [provider] The provider to use in Klasa
	 * @property {KlasaConsoleConfig} [console={}] Config options to pass to the client console
	 * @property {KlasaConsoleEvents} [consoleEvents={}] Config options to pass to the client console
	 * @property {string}  [language='en-US'] The default language Klasa should opt-in for the commands
	 * @property {number}  [promptTime=30000] The amount of time in milliseconds prompts should last
	 * @property {boolean} [ignoreBots=true] Whether or not this bot should ignore other bots
	 * @property {boolean} [ignoreSelf=true] Whether or not this bot should ignore itself
	 * @property {boolean} [cmdPrompt=false] Whether the bot should prompt missing parameters
	 * @property {boolean} [cmdEditing=false] Whether the bot should update responses if the command is edited
	 * @property {boolean} [cmdLogging=false] Whether the bot should log command usage
	 * @property {boolean} [typing=false] Whether the bot should type while processing commands.
	 * @property {boolean} [preserveConfigs=true] Whetheer the bot should preserve (non-default) configs when removed from a guild.
	 * @property {boolean} [quotedStringSupport=false] Whether the bot should default to using quoted string support in arg parsing, or not (overridable per command)
	 * @property {?(string|Function)} [readyMessage=`Successfully initialized. Ready to serve ${this.guilds.size} guilds.`] readyMessage to be passed thru Klasa's ready event
	 * @property {string} [ownerID] The discord user id for the user the bot should respect as the owner (gotten from Discord api if not provided)
	 */

	/**
	 * @typedef {Object} KlasaConsoleConfig
	 * @memberof KlasaClient
	 * @property {WriteableStream} [stdout=process.stdout] Output stream
	 * @property {WriteableStream} [stderr=process.stderr] Error stream
	 * @property {boolean} [useColor=false] Whether the client console should use colors
	 * @property {Colors} [colors] Color formats to use
	 * @property {(boolean|string)} [timestamps=true] Whether to use timestamps or not, or the moment format of the timestamp you want to use
	 */

	/**
	 * @typedef {Object} KlasaConsoleEvents
	 * @memberof KlasaClient
	 * @property {boolean} [log=true] If the log event should be enabled by default
	 * @property {boolean} [warn=true] If the warn event should be enabled by default
	 * @property {boolean} [error=true] If the error event should be enabled by default
	 * @property {boolean} [debug=false] If the debug event should be enabled by default
	 * @property {boolean} [verbose=false] If the verbose event should be enabled by default
	 * @property {boolean} [wtf=true] If the wtf event should be enabled by default
	 */

	/**
	 * Constructs the klasa client
	 * @since 0.0.1
	 * @param {KlasaClientConfig} config The config to pass to the new client
	 */
	constructor(config = {}) {
		if (typeof config !== 'object') throw new TypeError('Configuration for Klasa must be an object.');
		super(config.clientOptions);

		/**
		 * The config passed to the new Klasa.Client
		 * @since 0.0.1
		 * @type {KlasaClientConfig}
		 */
		this.config = config;
		this.config.provider = config.provider || {};
		this.config.console = config.console || {};
		this.config.consoleEvents = config.consoleEvents || {};
		this.config.language = config.language || 'en-US';
		this.config.promptTime = typeof config.promptTime === 'number' && Number.isInteger(config.promptTime) ? config.promptTime : 30000;
		this.config.commandMessageLifetime = config.commandMessageLifetime || 1800;
		this.config.preserveConfigs = 'preserverConfigs' in config ? config.preserveConfigs : true;

		/**
		 * The directory to the node_modules folder where Klasa exists
		 * @since 0.0.1
		 * @type {string}
		 */
		this.coreBaseDir = path.join(__dirname, '../');

		/**
		 * The directory where the user files are at
		 * @since 0.0.1
		 * @type {string}
		 */
		this.clientBaseDir = config.clientBaseDir ? path.resolve(config.clientBaseDir) : path.dirname(require.main.filename);

		/**
		 * The console for this instance of klasa. You can disable timestmaps, colors, and add writable streams as config options to configure this.
		 * @since 0.4.0
		 * @type {KlasaConsole}
		 */
		this.console = new Console({
			stdout: this.config.console.stdout,
			stderr: this.config.console.stderr,
			useColor: this.config.console.useColor,
			colors: this.config.console.colors,
			timestamps: this.config.console.timestamps
		});

		/**
		 * The argument resolver
		 * @since 0.0.1
		 * @type {ArgResolver}
		 */
		this.argResolver = new ArgResolver(this);

		/**
		 * The cache where commands are stored
		 * @since 0.0.1
		 * @type {CommandStore}
		 */
		this.commands = new CommandStore(this);

		/**
		 * The cache where inhibitors are stored
		 * @since 0.0.1
		 * @type {InhibitorStore}
		 */
		this.inhibitors = new InhibitorStore(this);

		/**
		 * The cache where finalizers are stored
		 * @since 0.0.1
		 * @type {FinalizerStore}
		 */
		this.finalizers = new FinalizerStore(this);

		/**
		 * The cache where monitors are stored
		 * @since 0.0.1
		 * @type {MonitorStore}
		 */
		this.monitors = new MonitorStore(this);

		/**
		 * The cache where languages are stored
		 * @since 0.2.1
		 * @type {LanguageStore}
		 */
		this.languages = new LanguageStore(this);

		/**
		 * The cache where providers are stored
		 * @since 0.0.1
		 * @type {ProviderStore}
		 */
		this.providers = new ProviderStore(this);

		/**
		 * The cache where events are stored
		 * @since 0.0.1
		 * @type {EventStore}
		 */
		this.events = new EventStore(this);

		/**
		 * The cache where extendables are stored
		 * @since 0.0.1
		 * @type {ExtendableStore}
		 */
		this.extendables = new ExtendableStore(this);

		/**
		 * A Store registry
		 * @since 0.3.0
		 * @type {external:Collection}
		 */
		this.pieceStores = new Discord.Collection();

		/**
		 * The permissions structure for this bot
		 * @since 0.0.1
		 * @type {PermissionLevels}
		 */
		this.permissionLevels = this.validatePermissionLevels();

		/**
		 * Whether the client is truely ready or not
		 * @since 0.0.1
		 * @type {boolean}
		 */
		this.ready = false;

		/**
		 * Additional methods to be used elsewhere in the bot
		 * @since 0.0.1
		 * @type {object}
		 * @property {class} Collection A discord.js collection
		 * @property {class} Embed A discord.js Message Embed
		 * @property {class} MessageCollector A discord.js MessageCollector
		 * @property {class} Webhook A discord.js WebhookClient
		 * @property {function} escapeMarkdown A discord.js escape markdown function
		 * @property {function} splitMessage A discord.js split message function
		 * @property {Util} util A collection of static methods to be used thoughout the bot
		 */
		this.methods = {
			Collection: Discord.Collection,
			Embed: Discord.MessageEmbed,
			MessageCollector: Discord.MessageCollector,
			Webhook: Discord.WebhookClient,
			escapeMarkdown: Discord.escapeMarkdown,
			splitMessage: Discord.splitMessage,
			util
		};

		/**
		 * The GatewayDriver instance where the gateways are stored
		 * @since 0.5.0
		 * @type {GatewayDriver}
		 */
		this.gateways = new GatewayDriver(this);

		/**
		 * The application info cached from the discord api
		 * @since 0.0.1
		 * @type {external:ClientApplication}
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
	 * @since 0.0.1
	 * @readonly
	 * @returns {string}
	 */
	get invite() {
		if (!this.user.bot) throw 'Why would you need an invite link for a selfbot...';
		const permissions = Discord.Permissions.resolve([...new Set(this.commands.reduce((a, b) => a.concat(b.botPerms), ['VIEW_CHANNEL', 'SEND_MESSAGES']))]);
		return `https://discordapp.com/oauth2/authorize?client_id=${this.application.id}&permissions=${permissions}&scope=bot`;
	}

	/**
	 * The owner for this bot
	 * @since 0.1.1
	 * @readonly
	 * @type {KlasaUser}
	 */
	get owner() {
		return this.users.get(this.config.ownerID);
	}

	/**
	 * Validates the permission structure passed to the client
	 * @since 0.0.1
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
	 * @since 0.3.0
	 * @param {Store} store The store that pieces will be stored in.
	 * @returns {KlasaClient} this client
	 */
	registerStore(store) {
		this.pieceStores.set(store.name, store);
		return this;
	}

	/**
	 * Unregisters a custom store from the client
	 * @since 0.3.0
	 * @param {Store} storeName The store that pieces will be stored in.
	 * @returns {KlasaClient} this client
	 */
	unregisterStore(storeName) {
		this.pieceStores.delete(storeName);
		return this;
	}

	/**
	 * Registers a custom piece to the client
	 * @since 0.3.0
	 * @param {string} pieceName The name of the piece, if you want to register an arg resolver for this piece
	 * @param {Store} store The store that pieces will be stored in.
	 * @returns {KlasaClient} this client
	 */
	registerPiece(pieceName, store) {
		// eslint-disable-next-line func-names
		ArgResolver.prototype[pieceName] = async function (arg, currentUsage, possible, repeat, msg) {
			const piece = store.get(arg);
			if (piece) return piece;
			if (currentUsage.type === 'optional' && !repeat) return null;
			throw (msg ? msg.language : this.language).get('RESOLVER_INVALID_PIECE', currentUsage.possibles[possible].name, pieceName);
		};
		return this;
	}

	/**
	 * Unregisters a custom piece from the client
	 * @since 0.3.0
	 * @param {string} pieceName The name of the piece
	 * @returns {KlasaClient} this client
	 */
	unregisterPiece(pieceName) {
		delete ArgResolver.prototype[pieceName];
		return this;
	}

	/**
	 * Use this to login to Discord with your bot
	 * @since 0.0.1
	 * @param {string} token Your bot token
	 * @returns {Promise<string>}
	 */
	async login(token) {
		const timer = new Stopwatch();
		const loaded = await Promise.all(this.pieceStores.map(async store => `Loaded ${await store.loadAll()} ${store.name}.`))
			.catch((err) => {
				console.error(err);
				process.exit();
			});
		this.emit('log', loaded.join('\n'));

		// Providers must be init before configs, and those before all other stores.
		await this.providers.init();
		await this.gateways.add('guilds', this.gateways.validateGuild, this.gateways.defaultDataSchema, undefined, false);
		await this.gateways.add('users', this.gateways.validateUser, undefined, undefined, false);
		this.emit('log', `Loaded in ${timer.stop()}.`);
		return super.login(token);
	}

	/**
	 * The once ready function for the client to init all pieces
	 * @since 0.0.1
	 * @private
	 */
	async _ready() {
		await this.gateways._ready();
		if (typeof this.config.ignoreBots === 'undefined') this.config.ignoreBots = true;
		if (typeof this.config.ignoreSelf === 'undefined') this.config.ignoreSelf = this.user.bot;
		if (this.user.bot) this.application = await super.fetchApplication();
		if (!this.config.ownerID) this.config.ownerID = this.user.bot ? this.application.owner.id : this.user.id;

		// Init all the pieces
		await Promise.all(this.pieceStores.filter(store => store.name !== 'providers').map(store => store.init()));
		util.initClean(this);
		this.ready = true;
		if (typeof this.config.readyMessage === 'undefined') this.emit('log', `Successfully initialized. Ready to serve ${this.guilds.size} guilds.`);
		else if (this.config.readyMessage !== null) this.emit('log', typeof this.config.readyMessage === 'function' ? this.config.readyMessage(this) : this.config.readyMessage);
		this.emit('klasaReady');
	}

	/**
	 * Sweeps all text-based channels' messages and removes the ones older than the max message or command message lifetime.
	 * If the message has been edited, the time of the edit is used rather than the time of the original message.
	 * @since 0.5.0
	 * @param {number} [lifetime=this.options.messageCacheLifetime] Messages that are older than this (in seconds)
	 * will be removed from the caches. The default is based on [ClientOptions#messageCacheLifetime]{@link https://discord.js.org/#/docs/main/master/typedef/ClientOptions?scrollTo=messageCacheLifetime}
	 * @param {number} [commandLifetime=this.config.commandMessageLifetime] Messages that are older than this (in seconds)
	 * will be removed from the caches. The default is based on {@link KlasaClientConfig#commandMessageLifetime}
	 * @returns {number} Amount of messages that were removed from the caches,
	 * or -1 if the message cache lifetime is unlimited
	 */
	sweepMessages(lifetime = this.options.messageCacheLifetime, commandLifetime = this.config.commandMessageLifetime) {
		if (typeof lifetime !== 'number' || isNaN(lifetime)) throw new TypeError('The lifetime must be a number.');
		if (lifetime <= 0) {
			this.emit('debug', 'Didn\'t sweep messages - lifetime is unlimited');
			return -1;
		}

		const lifetimeMs = lifetime * 1000;
		const commandLifetimeMs = commandLifetime * 1000;
		const now = Date.now();
		let channels = 0;
		let messages = 0;
		let commandMessages = 0;

		for (const channel of this.channels.values()) {
			if (!channel.messages) continue;
			channels++;

			for (const message of channel.messages.values()) {
				if (message.command && now - (message.editedTimestamp || message.createdTimestamp) > commandLifetimeMs) {
					channel.messages.delete(message.id);
					commandMessages++;
				} else if (!message.command && now - (message.editedTimestamp || message.createdTimestamp) > lifetimeMs) {
					channel.messages.delete(message.id);
					messages++;
				}
			}
		}

		this.emit('debug', `Swept ${messages} messages older than ${lifetime} seconds and ${commandMessages} command messages older than ${commandLifetime} seconds in ${channels} text-based channels`);
		return messages;
	}

}

/**
 * The default PermissionLevels
 * @since 0.2.1
 * @type {PermissionLevels}
 */
KlasaClient.defaultPermissionLevels = new PermLevels()
	.addLevel(0, false, () => true)
	.addLevel(6, false, (client, msg) => msg.guild && msg.member.permissions.has('MANAGE_GUILD'))
	.addLevel(7, false, (client, msg) => msg.guild && msg.member === msg.guild.owner)
	.addLevel(9, true, (client, msg) => msg.author === client.owner)
	.addLevel(10, false, (client, msg) => msg.author === client.owner);

/**
 * @typedef  {Object} ConfigUpdateEntryMany
 * @property {'MANY'} type
 * @property {string[]} keys
 * @property {Array<*>} values
 */

/**
 * Emitted when Klasa is fully ready and initialized.
 * @event KlasaClient#klasaReady
 * @since 0.3.0
 */

/**
 * A central logging event for Klasa.
 * @event KlasaClient#log
 * @since 0.3.0
 * @param {(string|Object)} data The data to log
 * @param {string} [type='log'] The type of log: 'log', 'debug', 'warn', or 'error'.
 */

/**
 * An event for handling verbose logs
 * @event KlasaClient#verbose
 * @since 0.4.0
 * @param {(string|Object)} data The data to log
 */

/**
 * An event for handling wtf logs (what a terrible failure)
 * @event KlasaClient#wtf
 * @since 0.4.0
 * @param {(string|Object)} data The data to log
 */

/**
 * Emitted when an unknown command is called.
 * @event KlasaClient#commandUnknown
 * @since 0.4.0
 * @param {KlasaMessage} message The message that triggered the command
 * @param {string} command The command attempted to run
 */

/**
 * Emitted when a command has been inhibited.
 * @event KlasaClient#commandInhibited
 * @since 0.3.0
 * @param {KlasaMessage} message The message that triggered the command
 * @param {Command} command The command triggered
 * @param {?string} response The reason why it was inhibited if not silent
 */

/**
 * Emitted when a command has been run.
 * @event KlasaClient#commandRun
 * @since 0.3.0
 * @param {KlasaMessage} message The message that triggered the command
 * @param {Command} command The command run
 * @param {string[]} args The raw arguments of the command
 */

/**
 * Emitted when a command has been run.
 * @event KlasaClient#commandSuccess
 * @since 0.5.0
 * @param {KlasaMessage} message The message that triggered the command
 * @param {Command} command The command run
 * @param {any[]} params The resolved parameters of the command
 * @param {?any} response Usually a response message, but whatever the command returned.
 */

/**
 * Emitted when a command has errored.
 * @event KlasaClient#commandError
 * @since 0.3.0
 * @param {KlasaMessage} message The message that triggered the command
 * @param {Command} command The command run
 * @param {any[]} params The resolved parameters of the command
 * @param {(string|Object)} error The command error
 */

/**
 * Emitted when a monitor has errored.
 * @event KlasaClient#monitorError
 * @since 0.4.0
 * @param {KlasaMessage} message The message that triggered the monitor
 * @param {Monitor} monitor The monitor run
 * @param {(Error|string)} error The monitor error
 */

/**
 * Emitted when {@link Configuration.updateOne}, {@link Configuration.updateArray} or {@link Configuration.reset}
 * is run. When {@link Configuration.updateMany} is run, the parameter path will be an object with the following format:
 * `{ type: 'MANY', keys: string[], values: Array<*> }`
 * @event KlasaClient#configUpdateEntry
 * @since 0.5.0
 * @param {Configuration} oldEntry The old configuration entry
 * @param {Configuration} newEntry The new configuration entry
 * @param {(string|ConfigUpdateEntryMany)} path The path of the key which changed
 */

/**
 * Emitted when {@link Gateway.deleteEntry} is run.
 * @event KlasaClient#configDeleteEntry
 * @since 0.5.0
 * @param {Configuration} entry The entry which got deleted
 */

/**
 * Emitted when {@link Gateway.createEntry} is run or when {@link Gateway.getEntry}
 * with the create parameter set to true creates the entry.
 * @event KlasaClient#configCreateEntry
 * @since 0.5.0
 * @param {Configuration} entry The entry which got created
 */

/**
 * Emitted when a piece is loaded. (This can be spammy on bot startup or anytime you reload all of a piece type.)
 * @event KlasaClient#pieceLoaded
 * @since 0.4.0
 * @param {Piece} piece The piece that was loaded
 */

/**
 * Emitted when a piece is unloaded.
 * @event KlasaClient#pieceUnloaded
 * @since 0.4.0
 * @param {Piece} piece The piece that was unloaded
 */

/**
 * Emitted when a piece is reloaded.
 * @event KlasaClient#pieceReloaded
 * @since 0.4.0
 * @param {Piece} piece The piece that was reloaded
 */

/**
 * Emitted when a piece is enabled.
 * @event KlasaClient#pieceEnabled
 * @since 0.4.0
 * @param {Piece} piece The piece that was enabled
 */

/**
 * Emitted when a piece is disabled.
 * @event KlasaClient#pieceDisabled
 * @since 0.4.0
 * @param {Piece} piece The piece that was disabled
 */

process.on('unhandledRejection', (err) => {
	if (!err) return;
	console.error(`Uncaught Promise Error: \n${err.stack || err}`);
});

module.exports = KlasaClient;
