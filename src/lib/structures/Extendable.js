const Piece = require('./base/Piece');
const Discord = require('discord.js');

/**
 * Base class for all Klasa Extendables. See {@tutorial CreatingExtendables} for more information how to use this class
 * to build custom extendables.
 * @tutorial CreatingExtendables
 * @extends {Piece}
 */
class Extendable extends Piece {

	/**
	 * @typedef {PieceOptions} ExtendableOptions
	 * @property {boolean} [klasa=false] If the extendable is for Klasa instead of Discord.js
	 * @property {string[]} [appliesTo=[]] What classes this extendable is for
	 */

	/**
	 * @since 0.0.1
	 * @param {KlasaClient} client The klasa client
	 * @param {ExtendableStore} store The extendable store
	 * @param {string} file The path from the pieces folder to the extendable file
	 * @param {boolean} core If the piece is in the core directory or not
	 * @param {ExtendableOptions} [options={}] The options for this extendable
	 */
	constructor(client, store, file, core, options = {}) {
		super(client, store, file, core, options);

		/**
		 * The discord classes this extendable applies to
		 * @since 0.0.1
		 * @type {string[]}
		 */
		this.appliesTo = options.appliesTo;

		/**
		 * The target library to apply this extendable to
		 * @since 0.0.1
		 * @type {boolean}
		 */
		this.target = options.klasa ? require('klasa') : Discord;

		this.staticPropertyNames = Object.getOwnPropertyNames(this.constructor)
			.filter(name => !['length', 'prototype', 'name'].includes(name));
		this.instancePropertyNames = Object.getOwnPropertyNames(this.constructor.prototype)
			.filter(name => name !== 'constructor');
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
	 * @returns {this}
	 * @chainable
	 */
	disable() {
		if (this.client.listenerCount('pieceDisabled')) this.client.emit('pieceDisabled', this);
		this.enabled = false;
		for (const structure of this.appliesTo) {
			const target = this.target[structure];
			for (const name of this.staticPropertyNames) delete target[name];
			for (const name of this.instancePropertyNames) delete target.prototype[name];
		}
		return this;
	}

	/**
	 * Enables this piece
	 * @since 0.0.1
	 * @param {boolean} [init=false] If the piece is being init or not
	 * @returns {this}
	 * @chainable
	 */
	enable(init = false) {
		if (!init && this.client.listenerCount('pieceEnabled')) this.client.emit('pieceEnabled', this);
		this.enabled = true;
		const staticPropertyDescriptors = Object.assign({}, ...this.staticPropertyNames
			.map(name => ({ [name]: { ...Object.getOwnPropertyDescriptor(this.constructor, name), writable: true, configurable: true } })));
		const instancePropertyDescriptors = Object.assign({}, ...this.instancePropertyNames
			.map(name => ({ [name]: Object.getOwnPropertyDescriptor(this.constructor.prototype, name) })));
		for (const structure of this.appliesTo) {
			Object.defineProperties(this.target[structure], staticPropertyDescriptors);
			Object.defineProperties(this.target[structure].prototype, instancePropertyDescriptors);
		}
		return this;
	}

	/**
	 * Defines the JSON.stringify behavior of this extendable.
	 * @returns {Object}
	 */
	toJSON() {
		return {
			...super.toJSON(),
			appliesTo: this.appliesTo.slice(0),
			target: this.target === Discord ? 'discord.js' : 'klasa'
		};
	}

}

module.exports = Extendable;
