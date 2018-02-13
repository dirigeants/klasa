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

	constructor(client, type, file, core, options) {
		/**
		 * If the piece is in the core directory or not
		 * @since 0.5.0
		 * @name Event#core
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
		 * The file location where this event is stored
		 * @since 0.0.1
		 * @type {string|string[]}
		 */
		this.file = file;

		/**
		 * The name of the event
		 * @since 0.0.1
		 * @type {string}
		 */
		this.name = options.name || (Array.isArray(file) ? file[file.length - 1].toLowerCase() : file).slice(0, -3);

		/**
		 * The type of Klasa piece this is
		 * @since 0.0.1
		 * @type {string}
		 */
		this.type = type;

		/**
		 * If the event is enabled or not
		 * @since 0.0.1
		 * @type {boolean}
		 */
		this.enabled = options.enabled;

		/**
		 * The store this piece is from
		 * @since 0.5.0
		 * @type {Store}
		 */
		this.store = this.client.pieceStores.get(`${this.type}s`);
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
	 * @returns {Promise<Piece>} The newly loaded piece
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
