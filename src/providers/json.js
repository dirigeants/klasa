const { Provider } = require('klasa');
const { resolve } = require('path');
const fs = require('fs-nextra');

module.exports = class extends Provider {

	constructor(...args) {
		super(...args, { description: 'Allows you to use JSON functionality throught Klasa' });
		this.baseDir = resolve(this.client.clientBaseDir, 'bwd', 'provider', 'json');
	}

	init() {
		return fs.ensureDir(this.baseDir).catch(err => this.client.emit('error', err));
	}

	/* Table methods */

	/**
	 * Checks if a directory exists.
	 * @param {string} table The name of the table you want to check.
	 * @returns {Promise<boolean>}
	 */
	hasTable(table) {
		return fs.pathExists(resolve(this.baseDir, table));
	}

	/**
	 * Creates a new directory.
	 * @param {string} table The name for the new directory.
	 * @returns {Promise<Void>}
	 */
	createTable(table) {
		return fs.mkdir(resolve(this.baseDir, table));
	}

	/**
	 * Recursively deletes a directory.
	 * @param {string} table The directory's name to delete.
	 * @returns {Promise<Void>}
	 */
	deleteTable(table) {
		return this.hasTable(table)
			.then(exists => exists ? fs.emptyDir(resolve(this.baseDir, table)).then(() => fs.remove(resolve(this.baseDir, table))) : null);
	}

	/* Document methods */

	/**
	 * Get all documents from a directory.
	 * @param {string} table The name of the directory to fetch from.
	 * @returns {Promise<Object[]>}
	 */
	getAll(table) {
		const dir = resolve(this.baseDir, table);
		return fs.readdir(dir)
			.then(files => Promise.all(files.map(file => fs.readJSON(resolve(dir, file)))));
	}

	/**
	 * Get a document from a directory.
	 * @param {string} table The name of the directory.
	 * @param {string} document The document name.
	 * @returns {Promise<?Object>}
	 */
	get(table, document) {
		return fs.readJSON(resolve(this.baseDir, table, `${document}.json`)).catch(() => null);
	}

	/**
	 * Check if the document exists.
	 * @param {string} table The name of the directory.
	 * @param {string} document The document name.
	 * @returns {Promise<boolean>}
	 */
	has(table, document) {
		return fs.pathExists(resolve(this.baseDir, table, `${document}.json`));
	}

	/**
	 * Get a random document from a directory.
	 * @param {string} table The name of the directory.
	 * @returns {Promise<Object>}
	 */
	getRandom(table) {
		return this.getAll(table).then(data => data[Math.floor(Math.random() * data.length)]);
	}

	/**
	 * Insert a new document into a directory.
	 * @param {string} table The name of the directory.
	 * @param {string} document The document name.
	 * @param {Object} data The object with all properties you want to insert into the document.
	 * @returns {Promise<Void>}
	 */
	create(table, document, data) {
		return fs.outputJSONAtomic(resolve(this.baseDir, table, `${document}.json`), Object.assign(data, { id: document }));
	}

	set(...args) {
		return this.create(...args);
	}

	insert(...args) {
		return this.create(...args);
	}

	/**
	 * Update a document from a directory.
	 * @param {string} table The name of the directory.
	 * @param {string} document The document name.
	 * @param {Object} data The object with all the properties you want to update.
	 * @returns {Promise<Void>}
	 */
	update(table, document, data) {
		return this.get(table, document)
			.then(current => fs.outputJSONAtomic(resolve(this.baseDir, table, `${document}.json`), Object.assign(current, data)));
	}

	/**
	 * Replace all the data from a document.
	 * @param {string} table The name of the directory.
	 * @param {string} document The document name.
	 * @param {Object} data The new data for the document.
	 * @returns {Promise<Void>}
	 */
	replace(table, document, data) {
		return fs.outputJSONAtomic(resolve(this.baseDir, table, `${document}.json`), data);
	}

	/**
	 * Delete a document from the table.
	 * @param {string} table The name of the directory.
	 * @param {string} document The document name.
	 * @returns {Promise<Void>}
	 */
	delete(table, document) {
		return fs.unlink(resolve(this.baseDir, table, `${document}.json`));
	}

};
