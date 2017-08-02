const Piece = require('./interfaces/Piece');
const Discord = require('discord.js');

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
	 */

	/**
	 * @param {KlasaClient} client The klasa client
	 * @param {string} dir The path to the core or user extendable pieces folder
	 * @param {string} file The path from the pieces folder to the extendable file
	 * @param {string[]} appliesTo The discord classes this extendable applies to
	 * @param {ExtendableOptions} options The options for this extendable
	 */
	constructor(client, dir, file, appliesTo = [], options = {}) {
		/**
		 * @type {KlasaClient}
		 */
		this.client = client;

		/**
		 * The directory to where this extendable piece is stored
		 * @type {string}
		 */
		this.dir = dir;

		/**
		 * The file location where this extendable is stored
		 * @type {string}
		 */
		this.file = file;

		/**
		 * The name of the extendable
		 * @type {string}
		 */
		this.name = options.name || file.slice(0, -3);

		/**
		 * The type of Klasa piece this is
		 * @type {string}
		 */
		this.type = 'extendable';

		/**
		 * The discord classes this extendable applies to
		 * @type{string[]}
		 */
		this.appliesTo = appliesTo;
	}

	/**
	 * The extend method to be overwritten in actual extend pieces
	 * @param {any} params Any parameters you want
	 * @abstract
	 * @returns {any}
	 */
	extend() {
		// Defined in extension Classes
	}

	/**
	 * The init method to apply the extend method to the Discord.js Class
	 * @private
	 */
	async init() {
		for (const structure of this.appliesTo) Object.defineProperty(Discord[structure].prototype, this.name, Object.getOwnPropertyDescriptor(this.constructor.prototype, 'extend'));
	}

	// left for documentation
	/* eslint-disable no-empty-function */
	async reload() {}
	unload() {}
	/* eslint-enable no-empty-function */

}

Piece.applyToClass(Extendable);

module.exports = Extendable;
