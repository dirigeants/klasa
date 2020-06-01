"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KlasaClient = void 0;
const core_1 = require("@klasa/core");
const utils_1 = require("@klasa/utils");
const path_1 = require("path");
const PermissionLevels_1 = require("./permissions/PermissionLevels");
// lib/schedule
const Schedule_1 = require("./schedule/Schedule");
// lib/structures
const ArgumentStore_1 = require("./structures/ArgumentStore");
const CommandStore_1 = require("./structures/CommandStore");
const ExtendableStore_1 = require("./structures/ExtendableStore");
const FinalizerStore_1 = require("./structures/FinalizerStore");
const InhibitorStore_1 = require("./structures/InhibitorStore");
const LanguageStore_1 = require("./structures/LanguageStore");
const MonitorStore_1 = require("./structures/MonitorStore");
const ProviderStore_1 = require("./structures/ProviderStore");
const SerializerStore_1 = require("./structures/SerializerStore");
const TaskStore_1 = require("./structures/TaskStore");
// lib/settings
const GatewayDriver_1 = require("./settings/gateway/GatewayDriver");
const Gateway_1 = require("./settings/gateway/Gateway");
// lib/settings/schema
const Schema_1 = require("./settings/schema/Schema");
// lib/util
const console_1 = require("@klasa/console");
const constants_1 = require("./util/constants");
/**
 * The client for handling everything. See {@tutorial GettingStarted} for more information how to get started using this class.
 * @tutorial GettingStarted
 */
let KlasaClient = /** @class */ (() => {
    class KlasaClient extends core_1.Client {
        /**
         * Constructs the Klasa client
         * @since 0.0.1
         * @param {KlasaClientOptions} [options={}] The config to pass to the new client
         */
        constructor(options = {}) {
            if (!utils_1.isObject(options))
                throw new TypeError('The Client Options for Klasa must be an object.');
            utils_1.mergeDefault(constants_1.KlasaClientDefaults, options);
            super(options);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            this.console = new console_1.KlasaConsole(this.options.console);
            this.arguments = new ArgumentStore_1.ArgumentStore(this);
            this.commands = new CommandStore_1.CommandStore(this);
            this.inhibitors = new InhibitorStore_1.InhibitorStore(this);
            this.finalizers = new FinalizerStore_1.FinalizerStore(this);
            this.monitors = new MonitorStore_1.MonitorStore(this);
            this.languages = new LanguageStore_1.LanguageStore(this);
            this.providers = new ProviderStore_1.ProviderStore(this);
            this.extendables = new ExtendableStore_1.ExtendableStore(this);
            this.tasks = new TaskStore_1.TaskStore(this);
            this.serializers = new SerializerStore_1.SerializerStore(this);
            this.permissionLevels = this.options.permissionLevels(new PermissionLevels_1.PermissionLevels());
            // eslint-disable-next-line
            this.permissionLevels['validate']();
            this.gateways = new GatewayDriver_1.GatewayDriver(this);
            const { guilds, users, clientStorage } = this.options.settings.gateways;
            const guildSchema = guilds.schema(new Schema_1.Schema());
            const userSchema = users.schema(new Schema_1.Schema());
            const clientSchema = clientStorage.schema(new Schema_1.Schema());
            // Update Guild Schema with Keys needed in Klasa
            const prefixKey = guildSchema.get('prefix');
            if (!prefixKey || prefixKey.default === null) {
                guildSchema.add('prefix', 'string', { array: Array.isArray(this.options.commands.prefix), default: this.options.commands.prefix });
            }
            const languageKey = guildSchema.get('language');
            if (!languageKey || languageKey.default === null) {
                guildSchema.add('language', 'language', { default: this.options.language });
            }
            guildSchema.add('disableNaturalPrefix', 'boolean', { configurable: Boolean(this.options.commands.regexPrefix) });
            // Register default gateways
            this.gateways
                .register(new Gateway_1.Gateway(this, 'guilds', { ...guilds, schema: guildSchema }))
                .register(new Gateway_1.Gateway(this, 'users', { ...users, schema: userSchema }))
                .register(new Gateway_1.Gateway(this, 'clientStorage', { ...clientStorage, schema: clientSchema }));
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
            const coreDirectory = path_1.join(__dirname, '../');
            for (const store of this.pieceStores.values())
                store.registerCoreDirectory(coreDirectory);
            this.schedule = new Schedule_1.Schedule(this);
            this.mentionPrefix = null;
            this.owners = new Set();
            if (this.constructor === KlasaClient)
                this.loadPlugins();
        }
        /**
         * The invite link for the bot
         * @since 0.0.1
         */
        get invite() {
            const { application } = this;
            if (!application)
                return null;
            const permissions = new core_1.Permissions(this.constructor.basePermissions).add(...this.commands.map(command => command.requiredPermissions)).bitfield;
            return `https://discordapp.com/oauth2/authorize?client_id=${application.id}&permissions=${permissions}&scope=bot`;
        }
        /**
         * Connects websocket to the api.
         */
        async connect() {
            this.application = await core_1.Application.fetch(this);
            if (!this.options.owners.length) {
                if (this.application.team)
                    for (const member of this.application.team.members.values())
                        this.owners.add(member.user);
                else
                    this.owners.add(this.application.owner);
            }
            else {
                for (const id of this.options.owners)
                    this.owners.add(await this.users.fetch(id));
            }
            const earlyLoadingStores = [this.providers, this.extendables, this.serializers];
            const lateLoadingStores = this.pieceStores.filter(store => !earlyLoadingStores.includes(store));
            await Promise.all(earlyLoadingStores.map(store => store.loadAll()));
            await Promise.all(earlyLoadingStores.map(store => store.init()));
            await this.gateways.init();
            await Promise.all(lateLoadingStores.map(store => store.loadAll()));
            try {
                await this.ws.spawn();
            }
            catch (err) {
                await this.destroy();
                throw err;
            }
            await Promise.all(lateLoadingStores.map(store => store.init()));
            const clientUser = this.user;
            this.mentionPrefix = new RegExp(`^<@!?${clientUser.id}>`);
            const clientStorage = this.gateways.get('clientStorage');
            this.settings = clientStorage.acquire(clientUser);
            await this.settings.sync();
            // Init the schedule
            await this.schedule.init();
            if (this.options.readyMessage !== null) {
                this.emit('log', typeof this.options.readyMessage === 'function' ? this.options.readyMessage(this) : this.options.readyMessage);
            }
            this.emit("ready" /* Ready */);
        }
        /**
         * Sweeps all text-based channels' messages and removes the ones older than the max message or command message lifetime.
         * If the message has been edited, the time of the edit is used rather than the time of the original message.
         * @since 0.5.0
         * @param lifetime Messages that are older than this (in milliseconds)
         * will be removed from the caches. The default is based on {@link ClientOptions#messageLifetime}
         * @param commandLifetime Messages that are older than this (in milliseconds)
         * will be removed from the caches. The default is based on {@link CommandHandlingOptions#messageLifetime}
         */
        _sweepMessages(lifetime = this.options.cache.messageLifetime, commandLifetime = this.options.commands.messageLifetime) {
            if (typeof lifetime !== 'number' || isNaN(lifetime))
                throw new TypeError('The lifetime must be a number.');
            if (lifetime <= 0) {
                this.emit('debug', 'Didn\'t sweep messages - lifetime is unlimited');
                return -1;
            }
            const now = Date.now();
            let channels = 0;
            let messages = 0;
            let commandMessages = 0;
            for (const channel of this.channels.values()) {
                if (!core_1.isTextBasedChannel(channel))
                    continue;
                channels++;
                channel.messages.sweep(message => {
                    if ((message.command || message.author === this.user) && now - (message.editedTimestamp || message.createdTimestamp) > commandLifetime) {
                        commandMessages++;
                        return true;
                    }
                    if (!message.command && message.author !== this.user && now - (message.editedTimestamp || message.createdTimestamp) > lifetime) {
                        messages++;
                        return true;
                    }
                    return false;
                });
            }
            this.emit("debug" /* Debug */, `Swept ${messages} messages older than ${lifetime} milliseconds and ${commandMessages} command messages older than ${commandLifetime} milliseconds in ${channels} text-based channels`);
            return messages;
        }
    }
    /**
     * The base Permissions that the {@link Client#invite} asks for. Defaults to [VIEW_CHANNEL, SEND_MESSAGES]
     * @since 0.5.0
     */
    KlasaClient.basePermissions = new core_1.Permissions(3072);
    /**
     * The default PermissionLevels
     * @since 0.2.1
     */
    KlasaClient.defaultPermissionLevels = new PermissionLevels_1.PermissionLevels()
        .add(0, () => true)
        .add(6, ({ member }) => member && member.permissions.has(core_1.Permissions.FLAGS["MANAGE_GUILD" /* ManageGuild */]), { fetch: true })
        .add(7, ({ member }) => member && member.id === member.guild.ownerID, { fetch: true })
        .add(9, ({ author, client }) => client.owners.has(author), { break: true })
        .add(10, ({ author, client }) => client.owners.has(author));
    /**
     * The default Guild Schema
     * @since 0.5.0
     */
    KlasaClient.defaultGuildSchema = new Schema_1.Schema()
        .add('prefix', 'string')
        .add('language', 'language')
        .add('disableNaturalPrefix', 'boolean')
        .add('disabledCommands', 'command', {
        array: true,
        filter: (_client, command, { language }) => {
            if (command.guarded)
                throw language.get('COMMAND_CONF_GUARDED', command.name);
        }
    });
    /**
     * The default User Schema
     * @since 0.5.0
     */
    KlasaClient.defaultUserSchema = new Schema_1.Schema();
    /**
     * The default Client Schema
     * @since 0.5.0
     */
    KlasaClient.defaultClientSchema = new Schema_1.Schema()
        .add('userBlacklist', 'user', { array: true })
        .add('guildBlacklist', 'string', { array: true, filter: (_client, value) => !constants_1.MENTION_REGEX.snowflake.test(value) })
        .add('schedules', 'any', { array: true });
    return KlasaClient;
})();
exports.KlasaClient = KlasaClient;
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
//# sourceMappingURL=Client.js.map