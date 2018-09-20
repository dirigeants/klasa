const Piece = require('./base/Piece');

/**
 * Base class for all Klasa Extendables. See {@tutorial CreatingExtendables} for more information how to use this class
 * to build custom extendables.
 * @tutorial CreatingExtendables
 * @extends {Piece}
 */
class Extendable extends Piece {

	/**
	 * @typedef {PieceOptions} ExtendableOptions
	 * @property {any[]} [appliesTo=[]] What classes this extendable is for
	 */

	/**
	 * @typedef {OriginalPropertyDescriptors} Object
	 * @property {any} staticPropertyDescriptors What classes this extendable is for
	 * @property {any} instancePropertyDescriptors What classes this extendable is for
	 * @private
	 */

	/**
	 * @since 0.0.1
	 * @param {KlasaClient} client The klasa client
	 * @param {ExtendableStore} store The extendable store
	 * @param {string[]} file The path from the pieces folder to the extendable file
	 * @param {string} directory The base directory to the pieces folder
	 * @param {ExtendableOptions} [options={}] The options for this extendable
	 */
	constructor(client, store, file, directory, options = {}) {
		super(client, store, file, directory, options);

		/**
		 * The discord classes this extendable applies to
		 * @since 0.0.1
		 * @type {any[]}
		 */
		this.appliesTo = options.appliesTo;

		const staticPropertyNames = Object.getOwnPropertyNames(this.constructor)
			.filter(name => !['length', 'prototype', 'name'].includes(name));
		const instancePropertyNames = Object.getOwnPropertyNames(this.constructor.prototype)
			.filter(name => name !== 'constructor');

		/**
		 * The discord classes this extendable applies to
		 * @since 0.5.0
		 * @type {any}
		 * @private
		 */
		this.staticPropertyDescriptors = Object.assign({}, ...staticPropertyNames
			.map(name => ({ [name]: { ...Object.getOwnPropertyDescriptor(this.constructor, name), writable: true, configurable: true } })));

		/**
		 * The discord classes this extendable applies to
		 * @since 0.5.0
		 * @type {any}
		 * @private
		 */
		this.instancePropertyDescriptors = Object.assign({}, ...instancePropertyNames
			.map(name => ({ [name]: Object.getOwnPropertyDescriptor(this.constructor.prototype, name) })));

		/**
		 * The discord classes this extendable applies to
		 * @since 0.5.0
		 * @type {Map<any, OriginalPropertyDescriptors>}
		 * @private
		 */
		this.originals = new Map(this.appliesTo.map(structure => [structure, { staticPropertyDescriptors: null, instancePropertyDescriptors: null }]));

		for (const [structure, originals] of this.originals) {
			originals.staticPropertyDescriptors = Object.assign({}, ...staticPropertyNames
				.map(name => ({ [name]: Object.getOwnPropertyDescriptor(structure, name) })));
			originals.instancePropertyDescriptors = Object.assign({}, ...instancePropertyNames
				.map(name => ({ [name]: Object.getOwnPropertyDescriptor(structure.prototype, name) })));
		}
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
			Object.defineProperties(structure, this.originals.get(structure).staticPropertyDescriptors);
			Object.defineProperties(structure.prototype, this.originals.get(structure).instancePropertyDescriptors);
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
		for (const structure of this.appliesTo) {
			Object.defineProperties(structure, this.staticPropertyDescriptors);
			Object.defineProperties(structure.prototype, this.instancePropertyDescriptors);
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
			appliesTo: this.appliesTo.map(fn => fn.name)
		};
	}

}

module.exports = Extendable;
