import { Permissions, ClientOptions, Application, User, Client } from '@klasa/core';
import { PermissionLevels } from './permissions/PermissionLevels';
import { Schedule } from './schedule/Schedule';
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
import { GatewayDriver } from './settings/gateway/GatewayDriver';
import { Schema } from './settings/schema/Schema';
import { KlasaConsole, ConsoleOptions } from '@klasa/console';
import type { Settings } from './settings/Settings';
export interface KlasaClientOptions extends ClientOptions {
    /**
     * The command handler options
     * @default {}
     */
    commands?: CommandHandlingOptions;
    /**
     * Config options to pass to the client console
     * @default {}
     */
    console?: ConsoleOptions;
    /**
     * Config options to pass to console events
     */
    consoleEvents?: ConsoleEvents;
    /**
     * The default language Klasa should opt-in for the commands
     * @default 'en-US'
     */
    language?: string;
    /**
     * The discord user id for the users the bot should respect as the owner (gotten from Discord api if not provided)
     */
    owners?: string[];
    /**
     * The permission levels to use with this bot
     */
    permissionLevels?: (permissionLevels: PermissionLevels) => PermissionLevels;
    /**
     * Whether the bot should handle unhandled promise rejections automatically (handles when false)
     * (also can be configured with process.env.NODE_ENV)
     */
    production?: boolean;
    /**
     * The ready message to be passed throughout Klasa's ready event
     * @default client => `Successfully initialized. Ready to serve ${client.guilds.size} guilds.`
     */
    readyMessage?: string | ((client: Client) => string);
    /**
     * The provider options
     * @default {}
     */
    providers?: ProviderClientOptions;
    /**
     * The settings options
     * @default {}
     */
    settings?: SettingsOptions;
    /**
     * The options for the internal clock module that runs Schedule
     * @default {}
     */
    schedule?: ScheduleOptions;
}
export interface CommandHandlingOptions {
    /**
     * Whether the bot should update responses if the command is edited
     * @default false
     */
    editing?: boolean;
    /**
     * Whether the bot should log command usage
     * @default false
     */
    logging?: boolean;
    /**
     * The threshold for how old command messages can be before sweeping since the last edit in seconds
     * @default 1800
     */
    messageLifetime?: number;
    /**
     * Whether the bot should allow prefixless messages in DMs
     * @default false
     */
    noPrefixDM?: boolean;
    /**
     * The default prefix the bot should respond to
     * @default null
     */
    prefix?: string | string[] | null;
    /**
     * The regular expression prefix if one is provided
     * @default null
     */
    regexPrefix?: RegExp | null;
    /**
     * Amount of time in ms before the bot will respond to a users command since the last command that user has run
     * @default 0
     */
    slowmode?: number;
    /**
     * If the slowmode time should reset if a user spams commands faster than the slowmode allows for
     * @default false
     */
    slowmodeAggressive?: boolean;
    /**
     * Whether the bot should type while processing commands
     * @default false
     */
    typing?: boolean;
    /**
     * Whether the bot should respond to case insensitive prefix or not
     * @default false
     */
    prefixCaseInsensitive?: boolean;
    /**
     * The defaults for custom prompts
     * @default {}
     */
    prompts?: CustomPromptDefaults;
}
export interface CustomPromptDefaults {
    /**
     * The number of re-prompts before custom prompt gives up
     * @default Infinity
     */
    limit?: number;
    /**
     * The time-limit for re-prompting custom prompts
     * @default 30000
     */
    time?: number;
    /**
     * Whether the custom prompt should respect quoted strings
     * @default false
     */
    quotedStringSupport?: boolean;
    /**
     * Whether or not to support to flags for custom prompts
     */
    flagSupport?: boolean;
}
export interface ProviderClientOptions {
    /**
     * The default provider to use.
     * @default 'json'
     */
    default?: string;
    /**
     * The connection options keyed by the provider name
     */
    [provider: string]: unknown;
}
export interface ScheduleOptions {
    /**
     * The interval in milliseconds for the clock to check the tasks
     * @default 60000
     */
    interval?: number;
}
export interface SettingsOptions {
    /**
     * The options for each built-in gateway
     * @default {}
     */
    gateways?: GatewaysOptions;
    /**
     * Whether the bot should preserve (non-default) settings when removed from a guild
     * @default true
     */
    preserve?: boolean;
}
export interface GatewaysOptions extends Partial<Record<string, {
    schema: (schema: Schema) => Schema;
}>> {
    /**
     * The options for clientStorage's gateway
     * @default {}
     */
    clientStorage?: {
        schema: (schema: Schema) => Schema;
    };
    /**
     * The options for guilds' gateway
     * @default {}
     */
    guilds?: {
        schema: (schema: Schema) => Schema;
    };
    /**
     * The options for users' gateway
     * @default {}
     */
    users?: {
        schema: (schema: Schema) => Schema;
    };
}
export interface ConsoleEvents {
    /**
      * If the debug event should be enabled by default
      * @default false
      */
    debug?: boolean;
    /**
      * If the error event should be enabled by default
      * @default true
      */
    error?: boolean;
    /**
      * If the log event should be enabled by default
      * @default true
      */
    log?: boolean;
    /**
      * If the verbose event should be enabled by default
      * @default false
      */
    verbose?: boolean;
    /**
      * If the warn event should be enabled by default
      * @default true
      */
    warn?: boolean;
    /**
      * If the warn event should be enabled by default
      * @default true
      */
    wtf?: boolean;
}
/**
 * The client for handling everything. See {@tutorial GettingStarted} for more information how to get started using this class.
 * @tutorial GettingStarted
 */
export declare class KlasaClient extends Client {
    /**
     * The console for this instance of klasa. You can disable timestamps, colors, and add writable streams as configuration options to configure this.
     * @since 0.4.0
     */
    console: KlasaConsole;
    /**
     * The cache where argument resolvers are stored
     * @since 0.5.0
     */
    arguments: ArgumentStore;
    /**
     * The cache where commands are stored
     * @since 0.0.1
     */
    commands: CommandStore;
    /**
     * The cache where inhibitors are stored
     * @since 0.0.1
     */
    inhibitors: InhibitorStore;
    /**
     * The cache where finalizers are stored
     * @since 0.0.1
     */
    finalizers: FinalizerStore;
    /**
     * The cache where monitors are stored
     * @since 0.0.1
     */
    monitors: MonitorStore;
    /**
     * The cache where languages are stored
     * @since 0.2.1
     * @type {LanguageStore}
     */
    languages: LanguageStore;
    /**
     * The cache where providers are stored
     * @since 0.0.1
     */
    providers: ProviderStore;
    /**
     * The cache where extendables are stored
     * @since 0.0.1
     */
    extendables: ExtendableStore;
    /**
     * The cache where tasks are stored
     * @since 0.5.0
     */
    tasks: TaskStore;
    /**
     * The Serializers where serializers are stored
     * @since 0.5.0
     */
    serializers: SerializerStore;
    /**
     * The permissions structure for this bot
     * @since 0.0.1
     */
    permissionLevels: PermissionLevels;
    /**
     * The GatewayDriver instance where the gateways are stored
     * @since 0.5.0
     */
    gateways: GatewayDriver;
    /**
     * The Schedule that runs the tasks
     * @since 0.5.0
     */
    schedule: Schedule;
    /**
     * The regexp for a prefix mention
     * @since 0.5.0
     */
    mentionPrefix: RegExp | null;
    /**
     * The Settings instance that handles this client's settings
     * @since 0.5.0
     */
    settings: Settings | null;
    /**
     * The application info cached from the discord api
     * @since 0.0.1
     */
    application: Application | null;
    /**
     * Constructs the Klasa client
     * @since 0.0.1
     * @param {KlasaClientOptions} [options={}] The config to pass to the new client
     */
    constructor(options?: Partial<KlasaClientOptions>);
    /**
     * The invite link for the bot
     * @since 0.0.1
     */
    get invite(): string;
    /**
     * The owners for this bot
     * @since 0.5.0
     */
    get owners(): Set<User>;
    /**
     * Connects websocket to the api.
     */
    connect(): Promise<void>;
    /**
     * Sweeps all text-based channels' messages and removes the ones older than the max message or command message lifetime.
     * If the message has been edited, the time of the edit is used rather than the time of the original message.
     * @since 0.5.0
     * @param lifetime Messages that are older than this (in milliseconds)
     * will be removed from the caches. The default is based on {@link ClientOptions#messageLifetime}
     * @param commandLifetime Messages that are older than this (in milliseconds)
     * will be removed from the caches. The default is based on {@link CommandHandlingOptions#messageLifetime}
     */
    protected _sweepMessages(lifetime?: number, commandLifetime?: number): number;
    /**
     * The base Permissions that the {@link Client#invite} asks for. Defaults to [VIEW_CHANNEL, SEND_MESSAGES]
     * @since 0.5.0
     */
    static basePermissions: Permissions;
    /**
     * The default PermissionLevels
     * @since 0.2.1
     */
    static defaultPermissionLevels: PermissionLevels;
    /**
     * The default Guild Schema
     * @since 0.5.0
     */
    static defaultGuildSchema: Schema;
    /**
     * The default User Schema
     * @since 0.5.0
     */
    static defaultUserSchema: Schema;
    /**
     * The default Client Schema
     * @since 0.5.0
     */
    static defaultClientSchema: Schema;
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
