const Piece = require('./interfaces/Piece');
const Discord = require('discord.js');
const util = require('util');

/**
 * Base class for all Klasa Extendables. See {@tutorial CreatingExtendables} for more information how to use this class
 * to build custom extendables.
 * @tutorial CreatingExtendables
 * @implements {Piece}
 */
class Extendable {

	/**
	 * @typedef {object} ExtendableOptions
	 * @memberof Extendable
	 * @property {string} [name = theFileName] The name of the extendable
	 * @property {boolean} [enabled = true] If the extendable is enabled or not
	 * @property {boolean} [klasa = false] If the extendable is for Klasa instead of Discord.js
	 * @property {string} [deprecated = null] If the extendable should be deprecated or not
	 */

	/**
	 * @since 0.0.1
	 * @param {KlasaClient} client The klasa client
	 * @param {string} dir The path to the core or user extendable pieces folder
	 * @param {string} file The path from the pieces folder to the extendable file
	 * @param {string[]} appliesTo The discord classes this extendable applies to
	 * @param {ExtendableOptions} options The options for this extendable
	 */
	constructor(client, dir, file, appliesTo = [], options = {}) {
		/**
		 * @since 0.0.1
		 * @type {KlasaClient}
		 */
		this.client = client;

		/**
		 * The directory to where this extendable piece is stored
		 * @since 0.0.1
		 * @type {string}
		 */
		this.dir = dir;

		/**
		 * The file location where this extendable is stored
		 * @since 0.0.1
		 * @type {string}
		 */
		this.file = file;

		/**
		 * The name of the extendable
		 * @since 0.0.1
		 * @type {string}
		 */
		this.name = options.name || file.slice(0, -3);

		/**
		 * The type of Klasa piece this is
		 * @since 0.0.1
		 * @type {string}
		 */
		this.type = 'extendable';

		/**
		 * The discord classes this extendable applies to
		 * @since 0.0.1
		 * @type{string[]}
		 */
		this.appliesTo = appliesTo;

		/**
		 * If the language is enabled or not
		 * @since 0.0.1
		 * @type {boolean}
		 */
		this.enabled = 'enabled' in options ? options.enabled : true;

		/**
		 * The target library to apply this extendable to
		 * @since 0.0.1
		 * @type {boolean}
		 */
		this.target = options.klasa ? require('klasa') : Discord;

		/**
		 * Whether the extendable should be deprecated or not
     * @since 0.4.0
		 * @type {?string}
		 */
		this.deprecated = typeof options.deprecated === 'string' ? options.deprecated : null;
	}

	/**
	 * The extend method to be overwritten in actual extend pieces
	 * @since 0.0.1
	 * @param {any} params Any parameters you want
	 * @abstract
	 * @returns {any}
	 */
	extend() {
		// Defined in extension Classes
	}

	/**
	 * The init method to apply the extend method to the Discord.js Class
	 * @since 0.0.1
	 * @returns {void}
	 */
	async init() {
		if (this.enabled) this.enable();
	}

	/**
	 * Disables this piece
	 * @since 0.0.1
	 * @returns {Piece} This piece
	 */
	disable() {
		this.enabled = false;
		for (const structure of this.appliesTo) delete this.target[structure].prototype[this.name];
		return this;
	}

	/**
	 * Enables this piece
	 * @since 0.0.1
	 * @returns {Piece} This piece
	 */
	enable() {
		this.enabled = true;
		const descriptor = Object.getOwnPropertyDescriptor(this.constructor.prototype, 'extend');
		if (this.deprecated !== null) {
			if (descriptor.value) descriptor.value = util.deprecate(descriptor.value, this.deprecated);
			if (descriptor.get) descriptor.get = util.deprecate(descriptor.get, this.deprecated);
			if (descriptor.set) descriptor.set = util.deprecate(descriptor.set, this.deprecated);
		}

		for (const structure of this.appliesTo) Object.defineProperty(this.target[structure].prototype, this.name, descriptor);
		return this;
	}

	// left for documentation
	/* eslint-disable no-empty-function */
	async reload() {}
	unload() {}
	/* eslint-enable no-empty-function */

}

Piece.applyToClass(Extendable, ['disable', 'enable']);

module.exports = Extendable;
