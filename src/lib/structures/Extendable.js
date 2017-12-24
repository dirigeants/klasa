const Piece = require('./interfaces/Piece');
const { mergeDefault } = require('../util/util');
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
	 * @property {string} [name=theFileName] The name of the extendable
	 * @property {boolean} [enabled=true] If the extendable is enabled or not
	 * @property {boolean} [klasa=false] If the extendable is for Klasa instead of Discord.js
	 * @memberof Extendable
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
		options = mergeDefault(client.options.pieceDefaults.extendables, options);

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
		this.enabled = options.enabled;

		/**
		 * The target library to apply this extendable to
		 * @since 0.0.1
		 * @type {boolean}
		 */
		this.target = options.klasa ? require('klasa') : Discord;
	}

	/**
	 * The extend method to be overwritten in actual extend pieces
	 * @since 0.0.1
	 * @param {*} params Any parameters you want
	 * @abstract
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
		if (this.enabled) this.enable(true);
	}

	/**
	 * Disables this piece
	 * @since 0.0.1
	 * @returns {Piece} This piece
	 */
	disable() {
		if (this.client.listenerCount('pieceDisabled')) this.client.emit('pieceDisabled', this);
		this.enabled = false;
		for (const structure of this.appliesTo) delete this.target[structure].prototype[this.name];
		return this;
	}

	/**
	 * Enables this piece
	 * @since 0.0.1
	 * @param {boolean} [init=false] If the piece is being init or not
	 * @returns {Piece} This piece
	 */
	enable(init = false) {
		if (!init && this.client.listenerCount('pieceEnabled')) this.client.emit('pieceEnabled', this);
		this.enabled = true;
		for (const structure of this.appliesTo) Object.defineProperty(this.target[structure].prototype, this.name, Object.getOwnPropertyDescriptor(this.constructor.prototype, 'extend'));
		return this;
	}

	// left for documentation
	/* eslint-disable no-empty-function */
	async reload() { }
	unload() { }
	/* eslint-enable no-empty-function */

}

Piece.applyToClass(Extendable, ['disable', 'enable']);

module.exports = Extendable;
