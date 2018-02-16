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
	 * @memberof Event
	 */

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

}

module.exports = Event;
