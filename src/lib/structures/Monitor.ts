import { Piece, PieceOptions } from '@klasa/core';
import { MonitorStore } from './MonitorStore';
import { KlasaMessage } from '../extensions/KlasaMessage';
import { MessageType } from '@klasa/dapi-types';

/**
 * Base class for all Klasa Monitors. See {@tutorial CreatingMonitors} for more information how to use this class
 * to build custom monitors.
 * @tutorial CreatingMonitors
 */
export abstract class Monitor extends Piece {

	/**
	 * The types of messages allowed for this monitor
	 * @since 0.5.0
	 */
	public allowedTypes: MessageType[];

	/**
	 * Whether the monitor ignores bots or not
	 * @since 0.0.1
	 */
	public ignoreBots: boolean;

	/**
	 * Whether the monitor ignores itself or not
	 * @since 0.0.1
	 */
	public ignoreSelf: boolean;

	/**
	 * Whether the monitor ignores others or not
	 * @since 0.4.0
	 */
	public ignoreOthers: boolean;

	/**
	 * Whether the monitor ignores webhooks or not
	 * @since 0.5.0
	 */
	public ignoreWebhooks: boolean;

	/**
	 * Whether the monitor ignores edits or not
	 * @since 0.5.0
	 */
	public ignoreEdits: boolean;

	/**
	 * Wether the monitor should ignore blacklisted users
	 * @since 0.5.0
	 */
	public ignoreBlacklistedUsers: boolean;

	/**
	 * Wether the monitor should ignore blacklisted guilds
	 * @since 0.5.0
	 */
	public ignoreBlacklistedGuilds: boolean;

	/**
	 * @since 0.0.1
	 * @param store The Monitor Store
	 * @param directory The base directory to the pieces folder
	 * @param files The path from the pieces folder to the monitor file
	 * @param options Optional Monitor settings
	 */
	public constructor(store: MonitorStore, directory: string, files: readonly string[], options: MonitorOptions = {}) {
		super(store, directory, files, options);
		this.allowedTypes = options.allowedTypes as MessageType[];
		this.ignoreBots = options.ignoreBots as boolean;
		this.ignoreSelf = options.ignoreSelf as boolean;
		this.ignoreOthers = options.ignoreOthers as boolean;
		this.ignoreWebhooks = options.ignoreWebhooks as boolean;
		this.ignoreEdits = options.ignoreEdits as boolean;
		this.ignoreBlacklistedUsers = options.ignoreBlacklistedUsers as boolean;
		this.ignoreBlacklistedGuilds = options.ignoreBlacklistedGuilds as boolean;
	}

	/**
	 * The run method to be overwritten in actual monitor pieces
	 * @since 0.0.1
	 * @param message The discord message
	 */
	public abstract async run(message: KlasaMessage): Promise<unknown>;

	/**
	 * If the monitor should run based on the filter options
	 * @since 0.5.0
	 * @param message The message to check
	 */
	public shouldRun(message: KlasaMessage): boolean {
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
	public toJSON(): object {
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
	private async _run(message: KlasaMessage): Promise<void> {
		try {
			await this.run(message);
		} catch (err) {
			this.client.emit('monitorError', message, this, err);
		}
	}

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
