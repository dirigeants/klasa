const { join } = require('path');
const fs = require('fs-nextra');
const { applyToClass } = require('../../util/util');

/**
 * The common interface for all stores
 * @see CommandStore
 * @see EventStore
 * @see ExtendableStore
 * @see FinalizerStore
 * @see InhibitorStore
 * @see MonitorStore
 * @see ProviderStore
 */
class Store {

	/**
	 * Deletes a piece from the store
	 * @param  {Piece|string} name The piece object or a string representing the structure this store caches
	 * @return {boolean} whether or not the delete was successful.
	 */
	delete(name) {
		const piece = this.resolve(name);
		if (!piece) return false;
		super.delete(piece.name);
		return true;
	}

	/**
	 * Initializes all pieces in this store.
	 * @return {Promise<Array>}
	 */
	init() {
		return Promise.all(this.map(piece => piece.init()));
	}

	/**
	 * Loads a piece into Klasa so it can be saved in this store.
	 * @param {string} dir The user directory or core directory where this file is saved.
	 * @param  {string} file A string showing where the file is located.
	 * @returns {Finalizer}
	 */
	load(dir, file) {
		const piece = this.set(new (require(join(dir, file)))(this.client, dir, file));
		delete require.cache[join(dir, file)];
		return piece;
	}

	/**
	 * Loads all of our pieces from both the user and core directories.
	 * @return {Promise<number>} The number of pieces loaded.
	 */
	async loadAll() {
		this.clear();
		const coreFiles = await fs.readdir(this.coreDir).catch(() => { fs.ensureDir(this.coreDir).catch(err => this.client.emit('errorlog', err)); });
		if (coreFiles) await Promise.all(coreFiles.map(this.load.bind(this, this.coreDir)));
		const userFiles = await fs.readdir(this.userDir).catch(() => { fs.ensureDir(this.userDir).catch(err => this.client.emit('errorlog', err)); });
		if (userFiles) await Promise.all(userFiles.map(this.load.bind(this, this.userDir)));
		return this.size;
	}

	/**
	 * Resolve a string or piece into a piece object.
	 * @param  {Piece|string} name The piece object or a string representing a piece's name
	 * @return {Piece}
	 */
	resolve(name) {
		if (name instanceof this.holds) return name;
		return this.get(name);
	}

	/**
	 * Sets up a piece in our store.
	 * @param {Piece} piece The piece object we are setting up.
	 * @returns {Piece}
	 */
	set(piece) {
		if (!(piece instanceof this.holds)) return this.client.emit('error', `Only ${this.holds.constructor.name}s may be stored in the Store.`);
		const existing = this.get(piece.name);
		if (existing) this.delete(existing);
		super.set(piece.name, piece);
		return piece;
	}

	/**
	 * Applies this interface to a class
	 * @param {Object} structure The structure to apply this interface to
	 * @param {string[]} skips The methods to skip when applying this interface
	 */
	static applyToClass(structure, skips) {
		applyToClass(Store, structure, skips);
	}

}

module.exports = Store;
