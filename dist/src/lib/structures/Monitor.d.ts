import { Piece, PieceOptions, Message } from '@klasa/core';
import type { MonitorStore } from './MonitorStore';
import type { MessageType } from '@klasa/dapi-types';
/**
 * Base class for all Klasa Monitors. See {@tutorial CreatingMonitors} for more information how to use this class
 * to build custom monitors.
 * @tutorial CreatingMonitors
 */
export declare abstract class Monitor extends Piece {
    /**
     * The types of messages allowed for this monitor
     * @since 0.5.0
     */
    allowedTypes: MessageType[];
    /**
     * Whether the monitor ignores bots or not
     * @since 0.0.1
     */
    ignoreBots: boolean;
    /**
     * Whether the monitor ignores itself or not
     * @since 0.0.1
     */
    ignoreSelf: boolean;
    /**
     * Whether the monitor ignores others or not
     * @since 0.4.0
     */
    ignoreOthers: boolean;
    /**
     * Whether the monitor ignores webhooks or not
     * @since 0.5.0
     */
    ignoreWebhooks: boolean;
    /**
     * Whether the monitor ignores edits or not
     * @since 0.5.0
     */
    ignoreEdits: boolean;
    /**
     * Wether the monitor should ignore blacklisted users
     * @since 0.5.0
     */
    ignoreBlacklistedUsers: boolean;
    /**
     * Wether the monitor should ignore blacklisted guilds
     * @since 0.5.0
     */
    ignoreBlacklistedGuilds: boolean;
    /**
     * @since 0.0.1
     * @param store The Monitor Store
     * @param directory The base directory to the pieces folder
     * @param files The path from the pieces folder to the monitor file
     * @param options Optional Monitor settings
     */
    constructor(store: MonitorStore, directory: string, files: readonly string[], options?: MonitorOptions);
    /**
     * The run method to be overwritten in actual monitor pieces
     * @since 0.0.1
     * @param message The discord message
     */
    abstract run(message: Message): Promise<unknown>;
    /**
     * If the monitor should run based on the filter options
     * @since 0.5.0
     * @param message The message to check
     */
    shouldRun(message: Message): boolean;
    /**
     * Defines the JSON.stringify behavior of this monitor.
     * @returns {Object}
     */
    toJSON(): Record<string, any>;
    /**
     * Run a monitor and catch any uncaught promises
     * @since 0.5.0
     * @param message The message object from @klasa/core
     */
    protected _run(message: Message): Promise<void>;
}
export interface MonitorOptions extends PieceOptions {
    allowedTypes?: MessageType[];
    ignoreBots?: boolean;
    ignoreSelf?: boolean;
    ignoreOthers?: boolean;
    ignoreWebhooks?: boolean;
    ignoreEdits?: boolean;
    ignoreBlacklistedUsers?: boolean;
    ignoreBlacklistedGuilds?: boolean;
}
