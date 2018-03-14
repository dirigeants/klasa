const { mergeDefault } = require('../../util/util');

/**
 * The common class for all pieces
 * @see Command
 * @see Event
 * @see Extendable
 * @see Finalizer
 * @see Inhibitor
 * @see Language
 * @see Monitor
 * @see Provider
 * @see Task
 */
class Piece {

	/**
	 * @typedef {Object} PieceOptions
	 * @property {string} [name=theFileName] The name of the event
	 * @property {boolean} [enabled=true] Whether the event is enabled or not
	 */

	/**
	 * @since 0.0.1
	 * @param {KlasaClient} client The klasa client
	 * @param {Store} store The store this piece is for
	 * @param {string} file The path from the pieces folder to the extendable file
	 * @param {boolean} core If the piece is in the core directory or not
	 * @param {PieceOptions} options The options for this piece
	 */
	constructor(client, store, file, core, options = {}) {
		const defaults = client.options.pieceDefaults[store.name];
		if (defaults) options = mergeDefault(defaults, options);

		/**
		 * If the piece is in the core directory or not
		 * @since 0.5.0
		 * @name Event#core
		 * @type {boolean}
		 * @readonly
		 */
		Object.defineProperty(this, 'core', { value: core });

		/**
		 * The client this Piece was created with
		 * @since 0.0.1
		 * @type {KlasaClient}
		 */
		this.client = client;

		/**
		 * The file location where this Piece is stored
		 * @since 0.0.1
		 * @type {string[]}
		 */
		this.file = file;

		/**
		 * The name of the Piece
		 * @since 0.0.1
		 * @type {string}
		 */
		this.name = options.name || file[file.length - 1].slice(0, -3);

		/**
		 * If the Piece is enabled or not
		 * @since 0.0.1
		 * @type {boolean}
		 */
		this.enabled = options.enabled;

		/**
		 * The store this Piece is from
		 * @since 0.5.0
		 * @type {Store}
		 */
		this.store = store;
	}

	/**
	 * The type of Klasa piece this is
	 * @since 0.0.1
	 * @type {string}
	 * @readonly
	 */
	get type() {
		return this.store.name.slice(0, -1);
	}

	/**
	 * The directory to where this event piece is stored
	 * @since 0.0.1
	 * @type {string}
	 * @readonly
	 */
	get dir() {
		return this.core ? this.store.coreDir : this.store.userDir;
	}

	/**
	 * Reloads this piece
	 * @since 0.0.1
	 * @returns {Piece} The newly loaded piece
	 */
	async reload() {
		const piece = this.store.load(this.file, this.core);
		await piece.init();
		if (this.client.listenerCount('pieceReloaded')) this.client.emit('pieceReloaded', piece);
		return piece;
	}

	/**
	 * Unloads this piece
	 * @since 0.0.1
	 * @returns {void}
	 */
	unload() {
		if (this.client.listenerCount('pieceUnloaded')) this.client.emit('pieceUnloaded', this);
		return this.store.delete(this);
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
		return this;
	}

	/**
	 * Enables this piece
	 * @since 0.0.1
	 * @returns {this}
	 * @chainable
	 */
	enable() {
		if (this.client.listenerCount('pieceEnabled')) this.client.emit('pieceEnabled', this);
		this.enabled = true;
		return this;
	}


	/**
	 * The init method to be optionally overwritten in actual commands
	 * @since 0.0.1
	 * @returns {*}
	 * @abstract
	 */
	async init() {
		// Optionally defined in extension Classes
	}

	/**
	 * Defines toString behavior for pieces
	 * @since 0.3.0
	 * @returns {string} This piece name
	 */
	toString() {
		return this.name;
	}

	/**
	 * Defines the JSON.stringify behavior of this task.
	 * @returns {Object}
	 */
	toJSON() {
		return {
			dir: this.dir,
			file: this.file,
			name: this.name,
			type: this.type,
			enabled: this.enabled
		};
	}

}

module.exports = Piece;
