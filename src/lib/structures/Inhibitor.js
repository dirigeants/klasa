const Piece = require('./interfaces/Piece');
const { mergeDefault } = require('../util/util');

/**
 * Base class for all Klasa Inhibitors. See {@tutorial CreatingInhibitors} for more information how to use this class
 * to build custom inhibitors.
 * @tutorial CreatingInhibitors
 * @implements {Piece}
 */
class Inhibitor {

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

		/**
		 * If the piece is in the core directory or not
		 * @since 0.5.0
		 * @name Command#core
		 * @type {boolean}
		 * @readonly
		 */
		Object.defineProperty(this, 'core', { value: core });

		/**
		 * @since 0.0.1
		 * @type {KlasaClient}
		 */
		this.client = client;

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
		this.enabled = options.enabled;

		/**
		 * If this inhibitor is meant for spamProtection (disables the inhibitor while generating help)
		 * @since 0.0.1
		 * @type {boolean}
		 */
		this.spamProtection = options.spamProtection;

		/**
		 * The store this piece is from
		 * @since 0.5.0
		 * @type {Store}
		 */
		this.store = this.client.pieceStores.get(`${this.type}s`);
	}

	/**
	 * The run method to be overwritten in actual inhibitors
	 * @since 0.0.1
	 * @param {KlasaMessage} msg The message that triggered this inhibitor
	 * @param {Command} cmd The command to run
	 * @returns {Promise<(void|string)>}
	 * @abstract
	 */
	async run() {
		// Defined in extension Classes
		return;
	}

	/**
	 * The init method to be optionally overwritten in actual inhibitors
	 * @since 0.0.1
	 * @returns {Promise<void>}
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
			dir: this.dir,
			file: this.file,
			name: this.name,
			type: this.type,
			enabled: this.enabled,
			spamProtection: this.spamProtection
		};
	}

	// left for documentation
	/* eslint-disable no-empty-function */
	get dir() {}
	async reload() {}
	unload() {}
	disable() {}
	enable() {}
	toString() {}
	/* eslint-enable no-empty-function */

}

Piece.applyToClass(Inhibitor);

module.exports = Inhibitor;
