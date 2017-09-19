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
	 * @return {Array}
	 */
	init() {
		return Promise.all(this.map(piece => piece.enabled ? piece.init() : true));
	}

	/**
	 * Loads a piece into Klasa so it can be saved in this store.
	 * @param {string} dir The user directory or core directory where this file is saved.
	 * @param  {string|Array} file A string showing where the file is located.
	 * @returns {?Piece}
	 */
	load(dir, file) {
		const loc = Array.isArray(file) ? join(dir, ...file) : join(dir, file);
		let piece = null;
		try {
			piece = this.set(new (require(loc))(this.client, dir, file));
		} catch (err) {
			const error = err.message.endsWith('not a constructor') ? new TypeError(`Non-Class Export: ${loc}`) : err;
			this.client.emit('wtf', error);
		}
		delete require.cache[loc];
		return piece;
	}

	/**
	 * Loads all of our pieces from both the user and core directories.
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
	 * @param  {Piece|string} name The piece object or a string representing a piece's name
	 * @return {Piece}
	 */
	resolve(name) {
		if (name instanceof this.holds) return name;
		return this.get(name);
	}

	/**
	 * Applies this interface to a class
	 * @param {Object} structure The structure to apply this interface to
	 * @param {string[]} [skips=[]] The methods to skip when applying this interface
	 */
	static applyToClass(structure, skips) {
		applyToClass(Store, structure, skips);
	}

}

module.exports = Store;
