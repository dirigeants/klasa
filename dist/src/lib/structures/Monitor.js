"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Monitor = void 0;
const core_1 = require("@klasa/core");
/**
 * Base class for all Klasa Monitors. See {@tutorial CreatingMonitors} for more information how to use this class
 * to build custom monitors.
 * @tutorial CreatingMonitors
 */
class Monitor extends core_1.Piece {
    /**
     * @since 0.0.1
     * @param store The Monitor Store
     * @param directory The base directory to the pieces folder
     * @param files The path from the pieces folder to the monitor file
     * @param options Optional Monitor settings
     */
    constructor(store, directory, files, options = {}) {
        super(store, directory, files, options);
        this.allowedTypes = options.allowedTypes;
        this.ignoreBots = options.ignoreBots;
        this.ignoreSelf = options.ignoreSelf;
        this.ignoreOthers = options.ignoreOthers;
        this.ignoreWebhooks = options.ignoreWebhooks;
        this.ignoreEdits = options.ignoreEdits;
        this.ignoreBlacklistedUsers = options.ignoreBlacklistedUsers;
        this.ignoreBlacklistedGuilds = options.ignoreBlacklistedGuilds;
    }
    /**
     * If the monitor should run based on the filter options
     * @since 0.5.0
     * @param message The message to check
     */
    shouldRun(message) {
        return this.enabled &&
            this.allowedTypes.includes(message.type) &&
            !(this.ignoreBots && message.author.bot) &&
            !(this.ignoreSelf && this.client.user === message.author) &&
            !(this.ignoreOthers && this.client.user !== message.author) &&
            !(this.ignoreWebhooks && message.webhookID) &&
            !(this.ignoreEdits && message.editedTimestamp);
        // !(this.ignoreBlacklistedUsers && this.client.settings.userBlacklist.includes(message.author.id)) &&
        // !(this.ignoreBlacklistedGuilds && message.guild && this.client.settings.guildBlacklist.includes(message.guild.id));
    }
    /**
     * Defines the JSON.stringify behavior of this monitor.
     * @returns {Object}
     */
    toJSON() {
        return {
            ...super.toJSON(),
            ignoreBots: this.ignoreBots,
            ignoreSelf: this.ignoreSelf,
            ignoreOthers: this.ignoreOthers,
            ignoreWebhooks: this.ignoreWebhooks,
            ignoreEdits: this.ignoreEdits,
            ignoreBlacklistedUsers: this.ignoreBlacklistedUsers,
            ignoreBlacklistedGuilds: this.ignoreBlacklistedGuilds
        };
    }
    /**
     * Run a monitor and catch any uncaught promises
     * @since 0.5.0
     * @param message The message object from @klasa/core
     */
    async _run(message) {
        try {
            await this.run(message);
        }
        catch (err) {
            this.client.emit('monitorError', message, this, err);
        }
    }
}
exports.Monitor = Monitor;
//# sourceMappingURL=Monitor.js.map