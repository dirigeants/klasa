const Piece = require('./base/Piece');
const { mergeDefault } = require('../util/util');

/**
 * Base class for all Klasa Inhibitors. See {@tutorial CreatingInhibitors} for more information how to use this class
 * to build custom inhibitors.
 * @tutorial CreatingInhibitors
 * @extends Piece
 */
class Inhibitor extends Piece {

	/**
	 * @typedef {Object} InhibitorOptions
	 * @property {string} [name=theFileName] The name of the inhibitor
	 * @property {boolean} [enabled=true] Whether the inhibitor is enabled or not
	 * @property {boolean} [spamProtection=false] If this inhibitor is meant for spamProtection (disables the inhibitor while generating help)
	 * @memberof Inhibitor
	 */

	/**
	 * @since 0.0.1
	 * @param {KlasaClient} client The Klasa client
	 * @param {string} file The path from the pieces folder to the inhibitor file
	 * @param {boolean} core If the piece is in the core directory or not
	 * @param {InhibitorOptions} [options={}] Optional Inhibitor settings
	 */
	constructor(client, file, core, options = {}) {
		options = mergeDefault(client.options.pieceDefaults.inhibitors, options);
		super(client, 'inhibitor', file, core, options);

		/**
		 * If this inhibitor is meant for spamProtection (disables the inhibitor while generating help)
		 * @since 0.0.1
		 * @type {boolean}
		 */
		this.spamProtection = options.spamProtection;
	}

	/**
	 * The run method to be overwritten in actual inhibitors
	 * @since 0.0.1
	 * @param {KlasaMessage} msg The message that triggered this inhibitor
	 * @param {Command} cmd The command to run
	 * @returns {(void|string)}
	 * @abstract
	 */
	async run() {
		// Defined in extension Classes
		return;
	}

	/**
	 * The init method to be optionally overwritten in actual inhibitors
	 * @since 0.0.1
	 * @returns {void}
	 * @abstract
	 */
	async init() {
		// Optionally defined in extension Classes
	}

	/**
	 * Defines the JSON.stringify behavior of this inhibitor.
	 * @returns {Object}
	 */
	toJSON() {
		return {
			...super.toJSON(),
			spamProtection: this.spamProtection
		};
	}

}

module.exports = Inhibitor;
