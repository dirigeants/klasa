const Piece = require('./base/Piece');

/**
 * Base class for all Klasa Events. See {@tutorial CreatingEvents} for more information how to use this class
 * to build custom events.
 * @tutorial CreatingEvents
 * @extends Piece
 */
class Event extends Piece {

	/**
	 * @typedef {PieceOptions} EventOptions
	 * @property {boolean} once If this event should only be run once and then unloaded
	 * @memberof Event
	 */

	/**
	 * @since 0.0.1
	 * @param {KlasaClient} client The Klasa client
	 * @param {EventStore} store The Event Store
	 * @param {string} file The path from the pieces folder to the event file
	 * @param {boolean} core If the piece is in the core directory or not
	 * @param {EventOptions} [options={}] Optional Event settings
	 */
	constructor(client, store, file, core, options = {}) {
		super(client, store, file, core, options);

		/**
		 * If this event should only be run once and then unloaded
		 * @since 0.5.0
		 * @type {boolean}
		 */
		this.once = options.once;
	}

	/**
	 * The run method to be overwritten in actual event handlers
	 * @since 0.0.1
	 * @param {*} param The event parameters emitted
	 * @returns {void}
	 * @abstract
	 */
	run() {
		// Defined in extension Classes
	}

	/**
	 * A wrapper for the run method, to easily disable/enable events
	 * @since 0.0.1
	 * @param {*} param The event parameters emitted
	 * @returns {void}
	 * @private
	 */
	async _run(...args) {
		if (!this.enabled) return;
		try {
			await this.run(...args);
		} catch (err) {
			this.client.emit('eventError', this, args, err);
		}
	}

	/**
	 * A wrapper for the _run method for once handling
	 * @since 0.0.1
	 * @param {*} param The event parameters emitted
	 * @returns {void}
	 * @private
	 */
	async _runOnce(...args) {
		if (!this.enabled) return;
		await this._run(...args);
		this.unload();
	}

	/**
	 * Defines the JSON.stringify behavior of this extendable.
	 * @returns {Object}
	 */
	toJSON() {
		return {
			...super.toJSON(),
			once: this.once
		};
	}

}

module.exports = Event;
