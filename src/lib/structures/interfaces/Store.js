const { join } = require('path');
const fs = require('fs-nextra');
const { applyToClass, isClass } = require('../../util/util');

/**
 * The common interface for all stores
 * @interface
 * @see CommandStore
 * @see EventStore
 * @see ExtendableStore
 * @see FinalizerStore
 * @see InhibitorStore
 * @see LanguageStore
 * @see MonitorStore
 * @see ProviderStore
 * @see TaskStore
 */
class Store {

	/**
	 * The directory of commands in Klasa relative to where its installed.
	 * @since 0.0.1
	 * @type {string}
	 * @readonly
	 */
	get coreDir() {
		return join(this.client.coreBaseDir, this.name);
	}

	/**
	 * The directory of local commands relative to where you run Klasa from.
	 * @since 0.0.1
	 * @type {string}
	 * @readonly
	 */
	get userDir() {
		return join(this.client.clientBaseDir, this.name);
	}

	/**
	 * Initializes all pieces in this store.
	 * @since 0.0.1
	 * @returns {Promise<Array<*>>}
	 */
	init() {
		return Promise.all(this.map(piece => piece.enabled ? piece.init() : piece.unload()));
	}

	/**
	 * Loads a piece into Klasa so it can be saved in this store.
	 * @since 0.0.1
	 * @param {string|string[]} file A string or array of strings showing where the file is located.
	 * @param {boolean} [core=false] If the file is located in the core directory or not
	 * @returns {?Piece}
	 */
	load(file, core = false) {
		const dir = core ? this.coreDir : this.userDir;
		const loc = Array.isArray(file) ? join(dir, ...file) : join(dir, file);
		if (!loc.endsWith('.js')) return null;
		let piece = null;
		try {
			const Piece = (req => req.default || req)(require(loc));
			if (!isClass(Piece)) throw new TypeError(`Failed to load file '${loc}'. The exported structure is not a class.`);
			piece = this.set(new Piece(this.client, file, core));
		} catch (error) {
			this.client.emit('wtf', `Failed to load file '${loc}'. Error:\n${error.stack || error}`);
		}
		delete require.cache[loc];
		return piece;
	}

	/**
	 * Loads all of our pieces from both the user and core directories.
	 * @since 0.0.1
	 * @returns {Promise<number>} The number of pieces loaded.
	 */
	async loadAll() {
		this.clear();
		if (this.coreDir) {
			const coreFiles = await fs.readdir(this.coreDir).catch(() => { fs.ensureDir(this.coreDir).catch(err => this.client.emit('error', err)); });
			if (coreFiles) await Promise.all(coreFiles.map(file => this.load(file, true)));
		}
		const userFiles = await fs.readdir(this.userDir).catch(() => { fs.ensureDir(this.userDir).catch(err => this.client.emit('error', err)); });
		if (userFiles) await Promise.all(userFiles.map(file => this.load(file)));
		return this.size;
	}

	/**
	 * Resolve a string or piece into a piece object.
	 * @since 0.0.1
	 * @param {Piece|string} name The piece object or a string representing a piece's name
	 * @returns {Piece}
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
