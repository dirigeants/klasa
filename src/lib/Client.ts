import { Client, Permissions, ClientOptions, Application, User } from '@klasa/core';
import { isObject, mergeDefault } from '@klasa/utils';
import { PermissionLevels } from './permissions/PermissionLevels';

// lib/schedule
import { Schedule } from './schedule/Schedule';

// lib/structures
import { ArgumentStore } from './structures/ArgumentStore';
import { CommandStore } from './structures/CommandStore';
import { ExtendableStore } from './structures/ExtendableStore';
import { FinalizerStore } from './structures/FinalizerStore';
import { InhibitorStore } from './structures/InhibitorStore';
import { LanguageStore } from './structures/LanguageStore';
import { MonitorStore } from './structures/MonitorStore';
import { ProviderStore } from './structures/ProviderStore';
import { SerializerStore } from './structures/SerializerStore';
import { TaskStore } from './structures/TaskStore';

// lib/settings
import { GatewayDriver } from './settings/GatewayDriver';

// lib/settings/schema
import { Schema } from './settings/schema/Schema';

// lib/util
import { KlasaConsole, ConsoleOptions } from './util/KlasaConsole';
import { KlasaClientDefaults, MENTION_REGEX } from './util/constants';

import type { Settings } from './settings/Settings';

export interface KlasaClientOptions extends ClientOptions {
	commands: CommandHandlingOptions;
	console: ConsoleOptions;
	// todo: Write out KlasaClientOptions
}

export interface CommandHandlingOptions {
	editing: boolean;
	logging: boolean;
	lifetime: number;
	// todo: Write out CommandHandlingOptions
}

/**
 * The client for handling everything. See {@tutorial GettingStarted} for more information how to get started using this class.
 * @extends external:Client
 * @tutorial GettingStarted
 */
export class KlasaClient extends Client {

	/**
	 * Defaulted as `Successfully initialized. Ready to serve ${this.guilds.size} guilds.`
	 * @typedef {(string|Function)} ReadyMessage
	 */

	/**
	 * Defaulted to KlasaClient.defaultPermissionLevels
	 * @typedef {PermissionLevels} PermissionLevelsOverload
	 */

	/**
	 * @typedef {external:DiscordClientOptions} KlasaClientOptions
	 * @property {boolean} [commandEditing=false] Whether the bot should update responses if the command is edited
	 * @property {boolean} [commandLogging=false] Whether the bot should log command usage
	 * @property {number} [commandMessageLifetime=1800] The threshold for how old command messages can be before sweeping since the last edit in seconds
	 * @property {ConsoleOptions} [console={}] Config options to pass to the client console
	 * @property {ConsoleEvents} [consoleEvents={}] Config options to pass to the client console
	 * @property {boolean} [createPiecesFolders=true] Whether Klasa should create pieces' folder at start up or not
	 * @property {CustomPromptDefaults} [customPromptDefaults={}] The defaults for custom prompts
	 * @property {string[]} [disabledCorePieces=[]] An array of disabled core piece types, e.g., ['commands', 'arguments']
	 * @property {GatewaysOptions} [gateways={}] The options for each built-in gateway
	 * @property {string} [language='en-US'] The default language Klasa should opt-in for the commands
	 * @property {boolean} [noPrefixDM=false] Whether the bot should allow prefixless messages in DMs
	 * @property {string[]} [owners] The discord user id for the users the bot should respect as the owner (gotten from Discord api if not provided)
	 * @property {PermissionLevelsOverload} [permissionLevels] The permission levels to use with this bot
	 * @property {PieceDefaults} [pieceDefaults={}] Overrides the defaults for all pieces
	 * @property {string|string[]} [prefix] The default prefix the bot should respond to
	 * @property {boolean} [preserveSettings=true] Whether the bot should preserve (non-default) settings when removed from a guild
	 * @property {boolean} [production=false] Whether the bot should handle unhandled promise rejections automatically (handles when false) (also can be configured with process.env.NODE_ENV)
	 * @property {ProvidersOptions} [providers] The provider options
	 * @property {ReadyMessage} [readyMessage] readyMessage to be passed throughout Klasa's ready event
	 * @property {RegExp} [regexPrefix] The regular expression prefix if one is provided
	 * @property {ScheduleOptions} [schedule={}] The options for the internal clock module that runs Schedule
	 * @property {number} [slowmode=0] Amount of time in ms before the bot will respond to a users command since the last command that user has run
	 * @property {boolean} [slowmodeAggressive=false] If the slowmode time should reset if a user spams commands faster than the slowmode allows for
	 * @property {boolean} [typing=false] Whether the bot should type while processing commands
	 * @property {boolean} [prefixCaseInsensitive=false] Wether the bot should respond to case insensitive prefix or not
	 */

	/**
	 * @typedef {Object} ProvidersOptions
	 * @property {string} [default] The default provider to use
	 */

	/**
	 * @typedef {Object} ScheduleOptions
	 * @property {number} [interval=60000] The interval in milliseconds for the clock to check the tasks
	 */

	/**
	 * @typedef {Object} GatewaysOptions
	 * @property {GatewayDriverRegisterOptions} [clientStorage] The options for clientStorage's gateway
	 * @property {GatewayDriverRegisterOptions} [guilds] The options for guilds' gateway
	 * @property {GatewayDriverRegisterOptions} [users] The options for users' gateway
	 */

	/**
	 * @typedef {Object} ConsoleEvents
	 * @property {boolean} [debug=false] If the debug event should be enabled by default
	 * @property {boolean} [error=true] If the error event should be enabled by default
	 * @property {boolean} [log=true] If the log event should be enabled by default
	 * @property {boolean} [verbose=false] If the verbose event should be enabled by default
	 * @property {boolean} [warn=true] If the warn event should be enabled by default
	 * @property {boolean} [wtf=true] If the wtf event should be enabled by default
	 */

	/**
	 * @typedef {Object} PieceDefaults
	 * @property {CommandOptions} [commands={}] The default command options
	 * @property {EventOptions} [events={}] The default event options
	 * @property {ExtendableOptions} [extendables={}] The default extendable options
	 * @property {FinalizerOptions} [finalizers={}] The default finalizer options
	 * @property {InhibitorOptions} [inhibitors={}] The default inhibitor options
	 * @property {LanguageOptions} [languages={}] The default language options
	 * @property {MonitorOptions} [monitors={}] The default monitor options
	 * @property {ProviderOptions} [providers={}] The default provider options
	 */

	/**
	 * @typedef {Object} CustomPromptDefaults
	 * @property {number} [limit=Infinity] The number of re-prompts before custom prompt gives up
	 * @property {number} [time=30000] The time-limit for re-prompting custom prompts
	 * @property {boolean} [quotedStringSupport=false] Whether the custom prompt should respect quoted strings
	 */

	/**
	 * The console for this instance of klasa. You can disable timestamps, colors, and add writable streams as configuration options to configure this.
	 * @since 0.4.0
	 */
	public console: KlasaConsole;

	/**
	 * The cache where argument resolvers are stored
	 * @since 0.5.0
	 */
	public arguments: ArgumentStore;

	/**
	 * The cache where commands are stored
	 * @since 0.0.1
	 */
	public commands: CommandStore;

	/**
	 * The cache where inhibitors are stored
	 * @since 0.0.1
	 */
	public inhibitors: InhibitorStore;

	/**
	 * The cache where finalizers are stored
	 * @since 0.0.1
	 */
	public finalizers: FinalizerStore;

	/**
	 * The cache where monitors are stored
	 * @since 0.0.1
	 */
	public monitors: MonitorStore;

	/**
	 * The cache where languages are stored
	 * @since 0.2.1
	 * @type {LanguageStore}
	 */
	public languages: LanguageStore;

	/**
	 * The cache where providers are stored
	 * @since 0.0.1
	 */
	public providers: ProviderStore;

	/**
	 * The cache where extendables are stored
	 * @since 0.0.1
	 */
	public extendables: ExtendableStore;

	/**
	 * The cache where tasks are stored
	 * @since 0.5.0
	 */
	public tasks: TaskStore;

	/**
	 * The Serializers where serializers are stored
	 * @since 0.5.0
	 */
	public serializers: SerializerStore;

	/**
	 * The permissions structure for this bot
	 * @since 0.0.1
	 */
	public permissionLevels: PermissionLevels;

	/**
	 * The GatewayDriver instance where the gateways are stored
	 * @since 0.5.0
	 */
	public gateways: GatewayDriver;


	/**
	 * The Schedule that runs the tasks
	 * @since 0.5.0
	 */
	public schedule: Schedule;

	/**
	 * Whether the client is truly ready or not
	 * @since 0.0.1
	 */
	public ready: boolean;

	/**
	 * The regexp for a prefix mention
	 * @since 0.5.0
	 */
	public mentionPrefix: RegExp | null;

	/**
	 * The Settings instance that handles this client's settings
	 * @since 0.5.0
	 */
	public settings: Settings | null;

	/**
	 * The application info cached from the discord api
	 * @since 0.0.1
	 */
	public application: Application | null;

	/**
	 * Constructs the Klasa client
	 * @since 0.0.1
	 * @param {KlasaClientOptions} [options={}] The config to pass to the new client
	 */
	public constructor(options: Partial<KlasaClientOptions> = {}) {
		if (!isObject(options)) throw new TypeError('The Client Options for Klasa must be an object.');
		options = mergeDefault(KlasaClientDefaults, options);
		super(options);

		this.console = new KlasaConsole(this.options.console);
		this.arguments = new ArgumentStore(this);
		this.commands = new CommandStore(this);
		this.inhibitors = new InhibitorStore(this);
		this.finalizers = new FinalizerStore(this);
		this.monitors = new MonitorStore(this);
		this.languages = new LanguageStore(this);
		this.providers = new ProviderStore(this);
		this.extendables = new ExtendableStore(this);
		this.tasks = new TaskStore(this);
		this.serializers = new SerializerStore(this);
		this.permissionLevels = this.validatePermissionLevels();
		this.gateways = new GatewayDriver(this);

		const { guilds, users, clientStorage } = this.options.gateways;
		const guildSchema = 'schema' in guilds ? guilds.schema : this.constructor.defaultGuildSchema;
		const userSchema = 'schema' in users ? users.schema : this.constructor.defaultUserSchema;
		const clientSchema = 'schema' in clientStorage ? clientStorage.schema : this.constructor.defaultClientSchema;

		// Update Guild Schema with Keys needed in Klasa
		const prefixKey = guildSchema.get('prefix');
		if (!prefixKey || prefixKey.default === null) {
			guildSchema.add('prefix', 'string', { array: Array.isArray(this.options.prefix), default: this.options.prefix });
		}

		const languageKey = guildSchema.get('language');
		if (!languageKey || languageKey.default === null) {
			guildSchema.add('language', 'language', { default: this.options.language });
		}

		guildSchema.add('disableNaturalPrefix', 'boolean', { configurable: Boolean(this.options.regexPrefix) });

		// Register default gateways
		this.gateways
			.register('guilds', { ...guilds, schema: guildSchema })
			.register('users', { ...users, schema: userSchema })
			.register('clientStorage', { ...clientStorage, schema: clientSchema });

		this.settings = null;
		this.application = null;

		this.registerStore(this.commands)
			.registerStore(this.inhibitors)
			.registerStore(this.finalizers)
			.registerStore(this.monitors)
			.registerStore(this.languages)
			.registerStore(this.providers)
			.registerStore(this.extendables)
			.registerStore(this.tasks)
			.registerStore(this.arguments)
			.registerStore(this.serializers);

		this.schedule = new Schedule(this);
		this.ready = false;
		this.mentionPrefix = null;
	}

	/**
	 * The invite link for the bot
	 * @since 0.0.1
	 */
	public get invite(): string {
		const permissions = new Permissions(this.constructor.basePermissions).add(...this.commands.map(command => command.requiredPermissions)).bitfield;
		return `https://discordapp.com/oauth2/authorize?client_id=${this.application.id}&permissions=${permissions}&scope=bot`;
	}

	/**
	 * The owners for this bot
	 * @since 0.5.0
	 */
	public get owners(): Set<User> {
		const owners = new Set();
		for (const owner of this.options.owners) {
			const user = this.users.get(owner);
			if (user) owners.add(user);
		}
		return owners;
	}

	/**
	 * Obtains the OAuth Application of the bot from Discord.
	 * When ran, this function will update {@link KlasaClient#application}.
	 * @since 0.0.1
	 */
	public async fetchApplication(): Promise<ClientApplication> {
		// todo: see what's up with @klasa/core fetchApplication
		this.application = await super.fetchApplication();
		return this.application;
	}

	/**
	 * Validates the permission structure passed to the client
	 * @since 0.0.1
	 */
	private validatePermissionLevels() {
		// todo: remove in favor of PermissionLevels#validate()
		const permissionLevels = this.options.permissionLevels || this.constructor.defaultPermissionLevels;
		if (!(permissionLevels instanceof PermissionLevels)) throw new Error('permissionLevels must be an instance of the PermissionLevels class');
		if (permissionLevels.isValid()) return permissionLevels;
		throw new Error(permissionLevels.debug());
	}

	/**
	 * Sweeps all text-based channels' messages and removes the ones older than the max message or command message lifetime.
	 * If the message has been edited, the time of the edit is used rather than the time of the original message.
	 * @since 0.5.0
	 * @param {number} [lifetime=this.options.messageCacheLifetime] Messages that are older than this (in seconds)
	 * will be removed from the caches. The default is based on [ClientOptions#messageCacheLifetime]{@link https://@klasa/core.org/#/docs/main/master/typedef/ClientOptions?scrollTo=messageCacheLifetime}
	 * @param {number} [commandLifetime=this.options.commandMessageLifetime] Messages that are older than this (in seconds)
	 * will be removed from the caches. The default is based on {@link KlasaClientOptions#commandMessageLifetime}
	 */
	protected sweepMessages(lifetime: number = this.options.messageCacheLifetime, commandLifetime: number = this.options.commands.lifetime): number {
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

			channel.messages.sweep(message => {
				if ((message.command || message.author === this.user) && now - (message.editedTimestamp || message.createdTimestamp) > commandLifetimeMs) return commandMessages++;
				if (!message.command && message.author !== this.user && now - (message.editedTimestamp || message.createdTimestamp) > lifetimeMs) return messages++;
				return false;
			});
		}

		this.emit('debug', `Swept ${messages} messages older than ${lifetime} seconds and ${commandMessages} command messages older than ${commandLifetime} seconds in ${channels} text-based channels`);
		return messages;
	}

	/**
	 * The base Permissions that the {@link Client#invite} asks for. Defaults to [VIEW_CHANNEL, SEND_MESSAGES]
	 * @since 0.5.0
	 */
	public static basePermissions = new Permissions(3072)

	/**
	 * The default PermissionLevels
	 * @since 0.2.1
	 */
	public static defaultPermissionLevels = new PermissionLevels()
		.add(0, () => true)
		.add(6, ({ guild, member }) => guild && member.permissions.has(FLAGS.MANAGE_GUILD), { fetch: true })
		.add(7, ({ guild, member }) => guild && member === guild.owner, { fetch: true })
		.add(9, ({ author, client }) => client.owners.has(author), { break: true })
		.add(10, ({ author, client }) => client.owners.has(author));


	/**
	 * The default Guild Schema
	 * @since 0.5.0
	 */
	public static defaultGuildSchema = new Schema()
		.add('prefix', 'string')
		.add('language', 'language')
		.add('disableNaturalPrefix', 'boolean')
		.add('disabledCommands', 'command', {
			array: true,
			filter: (client, command, piece, language) => {
				if (command.guarded) throw language.get('COMMAND_CONF_GUARDED', command.name);
			}
		});

	/**
	 * The default User Schema
	 * @since 0.5.0
	 */
	public static defaultUserSchema = new Schema();

	/**
	 * The default Client Schema
	 * @since 0.5.0
	 */
	public static defaultClientSchema = new Schema()
		.add('userBlacklist', 'user', { array: true })
		.add('guildBlacklist', 'string', { array: true, filter: (__, value) => !MENTION_REGEX.snowflake.test(value) })
		.add('schedules', 'any', { array: true });

}

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
 * @param {RegExp} prefix The prefix used
 * @param {number} prefixLength The length of the prefix used
 */

/**
 * Emitted when a command has been inhibited.
 * @event KlasaClient#commandInhibited
 * @since 0.3.0
 * @param {KlasaMessage} message The message that triggered the command
 * @param {Command} command The command triggered
 * @param {?string[]} response The reason why it was inhibited if not silent
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
 * @param {?any} response Usually a response message, but whatever the command returned
 */

/**
 * Emitted when a command has encountered an error.
 * @event KlasaClient#commandError
 * @since 0.3.0
 * @param {KlasaMessage} message The message that triggered the command
 * @param {Command} command The command run
 * @param {any[]} params The resolved parameters of the command
 * @param {Object} error The command error
 */

/**
 * Emitted when an invalid argument is passed to a command.
 * @event KlasaClient#argumentError
 * @since 0.5.0
 * @param {KlasaMessage} message The message that triggered the command
 * @param {Command} command The command run
 * @param {any[]} params The resolved parameters of the command
 * @param {string} error The argument error
 */

/**
 * Emitted when an event has encountered an error.
 * @event KlasaClient#eventError
 * @since 0.5.0
 * @param {Event} event The event that errored
 * @param {any[]} args The event arguments
 * @param {(string|Object)} error The event error
 */

/**
 * Emitted when a monitor has encountered an error.
 * @event KlasaClient#monitorError
 * @since 0.4.0
 * @param {KlasaMessage} message The message that triggered the monitor
 * @param {Monitor} monitor The monitor run
 * @param {(Error|string)} error The monitor error
 */

/**
 * Emitted when a finalizer has encountered an error.
 * @event KlasaClient#finalizerError
 * @since 0.5.0
 * @param {KlasaMessage} message The message that triggered the finalizer
 * @param {Command} command The command this finalizer is for (may be different than message.command)
 * @param {KlasaMessage|any} response The response from the command
 * @param {Stopwatch} timer The timer run from start to queue of the command
 * @param {Finalizer} finalizer The finalizer run
 * @param {(Error|string)} error The finalizer error
 */

/**
 * Emitted when a task has encountered an error.
 * @event KlasaClient#taskError
 * @since 0.5.0
 * @param {ScheduledTask} scheduledTask The scheduled task
 * @param {Task} task The task run
 * @param {(Error|string)} error The task error
 */

/**
 * Emitted when {@link Settings#update} or {@link Settings#reset} is run.
 * @event KlasaClient#settingsUpdateEntry
 * @since 0.5.0
 * @param {Settings} entry The patched Settings instance
 * @param {SettingsUpdateResultEntry[]} updated The keys that were updated
 */

/**
 * Emitted when {@link Settings#destroy} is run.
 * @event KlasaClient#settingsDeleteEntry
 * @since 0.5.0
 * @param {Settings} entry The entry which got deleted
 */

/**
 * Emitted when a new entry in the database has been created upon update.
 * @event KlasaClient#settingsCreateEntry
 * @since 0.5.0
 * @param {Settings} entry The entry which got created
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
