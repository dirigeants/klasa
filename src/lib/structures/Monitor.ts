import { Piece, PieceOptions, Message } from '@klasa/core';

import type { MonitorStore } from './MonitorStore';
import type { MessageType } from '@klasa/dapi-types';

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
	}

	/**
	 * The run method to be overwritten in actual monitor pieces
	 * @since 0.0.1
	 * @param message The discord message
	 */
	public abstract async run(message: Message): Promise<unknown>;

	/**
	 * If the monitor should run based on the filter options
	 * @since 0.5.0
	 * @param message The message to check
	 */
	public shouldRun(message: Message): boolean {
		return this.enabled &&
			this.allowedTypes.includes(message.type) &&
			!(this.ignoreBots && message.author.bot) &&
			!(this.ignoreSelf && this.client.user === message.author) &&
			!(this.ignoreOthers && this.client.user !== message.author) &&
			!(this.ignoreWebhooks && message.webhookID) &&
			!(this.ignoreEdits && message.editedTimestamp);
	}

	/**
	 * Defines the JSON.stringify behavior of this monitor.
	 * @returns {Object}
	 */
	public toJSON(): Record<string, any> {
		return {
			...super.toJSON(),
			ignoreBots: this.ignoreBots,
			ignoreSelf: this.ignoreSelf,
			ignoreOthers: this.ignoreOthers,
			ignoreWebhooks: this.ignoreWebhooks,
			ignoreEdits: this.ignoreEdits
		};
	}

	/**
	 * Run a monitor and catch any uncaught promises
	 * @since 0.5.0
	 * @param message The message object from @klasa/core
	 */
	protected async _run(message: Message): Promise<void> {
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
}
