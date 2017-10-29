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
	 * Initializes all pieces in this store.
	 * @since 0.0.1
	 * @return {Array}
	 */
	init() {
		return Promise.all(this.map(piece => piece.enabled ? piece.init() : true));
	}

	/**
	 * Loads a piece into Klasa so it can be saved in this store.
	 * @since 0.0.1
	 * @param {string} dir The user directory or core directory where this file is saved.
	 * @param  {string|string[]} file A string or array of strings showing where the file is located.
	 * @returns {?Piece}
	 */
	load(dir, file) {
		const loc = Array.isArray(file) ? join(dir, ...file) : join(dir, file);
		let piece = null;
		try {
			piece = this.set(new (require(loc))(this.client, dir, file));
		} catch (err) {
			const error = err.message.endsWith('not a constructor') ? new TypeError(`Exported Structure Not A Class`) : err;
			this.client.emit('wtf', `${error}\n${loc}`);
		}
		delete require.cache[loc];
		return piece;
	}

	/**
	 * Loads all of our pieces from both the user and core directories.
	 * @since 0.0.1
	 * @return {number} The number of pieces loaded.
	 */
	async loadAll() {
		this.clear();
		if (this.coreDir) {
			const coreFiles = await fs.readdir(this.coreDir).catch(() => { fs.ensureDir(this.coreDir).catch(err => this.client.emit('error', err)); });
			if (coreFiles) await Promise.all(coreFiles.map(this.load.bind(this, this.coreDir)));
		}
		const userFiles = await fs.readdir(this.userDir).catch(() => { fs.ensureDir(this.userDir).catch(err => this.client.emit('error', err)); });
		if (userFiles) await Promise.all(userFiles.map(this.load.bind(this, this.userDir)));
		return this.size;
	}

	/**
	 * Resolve a string or piece into a piece object.
	 * @since 0.0.1
	 * @param  {Piece|string} name The piece object or a string representing a piece's name
	 * @return {Piece}
	 */
	resolve(name) {
		if (name instanceof this.holds) return name;
		return this.get(name);
	}

	/**
	 * Defines toString behavior for stores
	 * @since 0.3.0
	 * @returns {string} This store name
	 */
	toString() {
		return this.name;
	}

	/**
	 * Applies this interface to a class
	 * @since 0.1.1
	 * @param {Object} structure The structure to apply this interface to
	 * @param {string[]} [skips=[]] The methods to skip when applying this interface
	 */
	static applyToClass(structure, skips) {
		applyToClass(Store, structure, skips);
	}

}

module.exports = Store;
