const Piece = require('./interfaces/Piece');

/**
 * Base class for all Klasa Inhibitors. See {@tutorial CreatingInhibitors} for more information how to use this class
 * to build custom inhibitors.
 * @tutorial CreatingInhibitors
 * @implements {Piece}
 */
class Inhibitor {

	/**
	 * @typedef {Object} InhibitorOptions
	 * @memberof Inhibitor
	 * @property {string} [name = theFileName] The name of the inhibitor
	 * @property {boolean} [enabled=true] Whether the inhibitor is enabled or not
	 * @property {boolean} [spamProtection=false] If this inhibitor is meant for spamProtection (disables the inhibitor while generating help)
	 */

	/**
	 * @since 0.0.1
	 * @param {KlasaClient} client The Klasa client
	 * @param {string} dir The path to the core or user inhibitor pieces folder
	 * @param {string} file The path from the pieces folder to the inhibitor file
	 * @param {InhibitorOptions} [options = {}] Optional Inhibitor settings
	 */
	constructor(client, dir, file, options = {}) {
		/**
		 * @since 0.0.1
		 * @type {KlasaClient}
		 */
		this.client = client;

		/**
		 * The directory to where this inhibitor piece is stored
		 * @since 0.0.1
		 * @type {string}
		 */
		this.dir = dir;

		/**
		 * The file location where this inhibitor is stored
		 * @since 0.0.1
		 * @type {string}
		 */
		this.file = file;

		/**
		 * The name of the inhibitor
		 * @since 0.0.1
		 * @type {string}
		 */
		this.name = options.name || file.slice(0, -3);

		/**
		 * The type of Klasa piece this is
		 * @since 0.0.1
		 * @type {string}
		 */
		this.type = 'inhibitor';

		/**
		 * If the inhibitor is enabled or not
		 * @since 0.0.1
		 * @type {boolean}
		 */
		this.enabled = 'enabled' in options ? options.enabled : true;

		/**
		 * If this inhibitor is meant for spamProtection (disables the inhibitor while generating help)
		 * @since 0.0.1
		 * @type {boolean}
		 */
		this.spamProtection = 'spamProtection' in options ? options.spamProtection : false;
	}

	/**
	 * The run method to be overwritten in actual inhibitors
	 * @since 0.0.1
	 * @param {external:Message} msg The message that triggered this inhibitor
	 * @param {Command} cmd The command to run
	 * @abstract
	 * @returns {(void|string)}
	 */
	run() {
		// Defined in extension Classes
	}

	/**
	 * The init method to be optionaly overwritten in actual inhibitors
	 * @since 0.0.1
	 * @abstract
	 * @returns {void}
	 */
	async init() {
		// Optionally defined in extension Classes
	}

	// left for documentation
	/* eslint-disable no-empty-function */
	async reload() {}
	unload() {}
	disable() {}
	enable() {}
	/* eslint-enable no-empty-function */

}

Piece.applyToClass(Inhibitor);

module.exports = Inhibitor;
