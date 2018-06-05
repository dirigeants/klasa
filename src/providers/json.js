const { Provider, util } = require('klasa');
const { resolve } = require('path');
const fs = require('fs-nextra');

module.exports = class extends Provider {

	constructor(...args) {
		super(...args);
		this.baseDir = resolve(this.client.clientBaseDir, 'bwd', 'provider', 'json');
	}

	/**
	 * Initializes the database
	 * @private
	 */
	async init() {
		await fs.ensureDir(this.baseDir).catch(err => this.client.emit('error', err));
	}

	/* Table methods */

	/**
	 * Checks if a directory exists.
	 * @param {string} table The name of the table you want to check
	 * @returns {Promise<boolean>}
	 */
	hasTable(table) {
		return fs.pathExists(resolve(this.baseDir, table));
	}

	/**
	 * Creates a new directory.
	 * @param {string} table The name for the new directory
	 * @returns {Promise<void>}
	 */
	createTable(table) {
		return fs.mkdir(resolve(this.baseDir, table));
	}

	/**
	 * Recursively deletes a directory.
	 * @param {string} table The directory's name to delete
	 * @returns {Promise<void>}
	 */
	deleteTable(table) {
		return this.hasTable(table)
			.then(exists => exists ? fs.emptyDir(resolve(this.baseDir, table)).then(() => fs.remove(resolve(this.baseDir, table))) : null);
	}

	/* Document methods */

	/**
	 * Get all documents from a directory.
	 * @param {string} table The name of the directory to fetch from
	 * @param {string[]} [entries] The entries to download, defaults to all keys in the directory
	 * @returns {Object[]}
	 */
	async getAll(table, entries) {
		if (!entries) entries = await this.getKeys(table);
		if (entries.length < 5000) {
			return Promise.all(entries.map(this.get.bind(this, table)));
		} else {
			const chunks = util.chunk(entries, 5000);
			const output = [];
			for (const chunk of chunks) output.push(...await chunk.map(this.get.bind(this, table)));
			return output;
		}
	}

	/**
	 * Get all document names from a directory, filter by json.
	 * @param {string} table The name of the directory to fetch from
	 * @returns {string[]}
	 */
	async getKeys(table) {
		const dir = resolve(this.baseDir, table);
		const filenames = await fs.readdir(dir);
		const files = [];
		for (const filename of filenames) {
			if (filename.endsWith('.json')) files.push(filename.slice(0, filename.length - 5));
		}
		return files;
	}

	/**
	 * Get a document from a directory.
	 * @param {string} table The name of the directory
	 * @param {string} id The document name
	 * @returns {Promise<?Object>}
	 */
	get(table, id) {
		return fs.readJSON(resolve(this.baseDir, table, `${id}.json`)).catch(() => null);
	}

	/**
	 * Check if the document exists.
	 * @param {string} table The name of the directory
	 * @param {string} id The document name
	 * @returns {Promise<boolean>}
	 */
	has(table, id) {
		return fs.pathExists(resolve(this.baseDir, table, `${id}.json`));
	}

	/**
	 * Get a random document from a directory.
	 * @param {string} table The name of the directory
	 * @returns {Promise<Object>}
	 */
	getRandom(table) {
		return this.getAll(table).then(data => data[Math.floor(Math.random() * data.length)]);
	}

	/**
	 * Remove a value or object from all entries.
	 * @param {string} table The name of the directory
	 * @param {string} [path=''] The key's path to update
	 * @param {boolean} nice Whether the provider should update all entries at the same time or politely update them sequentially
	 */
	async removeValue(table, path = '', nice = false) {
		const route = path.split('.');
		if (nice) {
			const values = await this.getAll(table, true);
			for (let i = 0; i < values.length; i++) await this._removeValue(table, route, values[i]);
		} else {
			const values = await this.getAll(table);
			await Promise.all(values.map(object => this._removeValue(table, route, object)));
		}
	}

	/**
	 * Insert a new document into a directory.
	 * @param {string} table The name of the directory
	 * @param {string} document The document name
	 * @param {Object} data The object with all properties you want to insert into the document
	 * @returns {Promise<void>}
	 */
	create(table, document, data = {}) {
		return fs.outputJSONAtomic(resolve(this.baseDir, table, `${document}.json`), util.mergeObjects({ id: document }, data));
	}

	/**
	 * Update a document from a directory.
	 * @param {string} table The name of the directory
	 * @param {string} document The document name
	 * @param {Object} data The object with all the properties you want to update
	 * @returns {void}
	 */
	async update(table, document, data) {
		const existent = await this.get(table, document);
		return fs.outputJSONAtomic(resolve(this.baseDir, table, `${document}.json`), util.mergeObjects(existent || { id: document }, this.parseUpdateInput(data)));
	}

	/**
	 * Replace all the data from a document.
	 * @param {string} table The name of the directory
	 * @param {string} document The document name
	 * @param {Object} data The new data for the document
	 * @returns {Promise<void>}
	 */
	replace(table, document, data) {
		return fs.outputJSONAtomic(resolve(this.baseDir, table, `${document}.json`), this.parseUpdateInput(data));
	}

	/**
	 * Delete a document from the table.
	 * @param {string} table The name of the directory
	 * @param {string} document The document name
	 * @returns {Promise<void>}
	 */
	delete(table, document) {
		return fs.unlink(resolve(this.baseDir, table, `${document}.json`));
	}

	/**
	 * Remove a value from a specified entry.
	 * @param {string} table The name of the directory
	 * @param {string[]} route An array with the path to update
	 * @param {Object} object The entry to update
	 * @returns {Promise<void>}
	 * @private
	 */
	_removeValue(table, route, object) {
		let value = object;
		const last = route.pop();
		for (const piece of route) {
			if (typeof value[piece] === 'undefined') return null;
			value = value[piece];
		}
		if (typeof value[last] === 'undefined') return null;

		delete value[last];
		return this.replace(table, object.id, object);
	}

};
