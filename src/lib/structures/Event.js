const Piece = require('./base/Piece');
const { mergeDefault } = require('../util/util');

/**
 * Base class for all Klasa Events. See {@tutorial CreatingEvents} for more information how to use this class
 * to build custom events.
 * @tutorial CreatingEvents
 * @extends Piece
 */
class Event extends Piece {

	/**
	 * @typedef {Object} EventOptions
	 * @property {string} [name=theFileName] The name of the event
	 * @property {boolean} [enabled=true] Whether the event is enabled or not
	 * @memberof Event
	 */

	/**
	 * @since 0.0.1
	 * @param {KlasaClient} client The klasa client
	 * @param {string} file The path from the pieces folder to the event file
	 * @param {boolean} core If the piece is in the core directory or not
	 * @param {EventOptions} [options={}] The Event options
	 */
	constructor(client, file, core, options = {}) {
		options = mergeDefault(client.options.pieceDefaults.events, options);
		super(client, 'event', file, core, options);
	}

	/**
	 * A wrapper for the run method, to easily disable/enable events
	 * @since 0.0.1
	 * @param {*} param The event parameters emitted
	 * @returns {void}
	 * @private
	 */
	async _run(...args) {
		if (this.enabled) {
			try {
				await this.run(...args);
			} catch (err) {
				this.client.emit('eventError', this, args, err);
			}
		}
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
	 * The init method to be optionally overwritten in actual events
	 * @since 0.0.1
	 * @returns {void}
	 * @abstract
	 */
	async init() {
		// Optionally defined in extension Classes
	}

}

module.exports = Event;
