const Piece = require('./base/Piece');
const { isObject, makeObject, getDeepTypeName } = require('../util/util');
const { join } = require('path');

/**
 * Base class for all Klasa Providers. See {@tutorial CreatingProviders} for more information how to use this class
 * to build custom providers.
 * @tutorial CreatingProviders
 * @extends {Piece}
 */
class Provider extends Piece {

	/**
	 * @typedef {ConfigurationUpdateResultEntry[]|Array<Array<string|*>>|Object<string, *>} ProviderResolvable
	 */

	/**
	 * The createTable method which inserts/creates a new table to the database.
	 * @since 0.0.1
	 * @param {string} table The table to check against
	 * @returns {*}
	 * @abstract
	 */
	async createTable() {
		throw new Error(`[PROVIDERS] ${join(this.dir, ...this.file)} | Missing method 'createTable' of ${this.constructor.name}`);
	}

	/**
	 * The deleteTable method which deletes/drops a table from the database.
	 * @since 0.0.1
	 * @param {string} table The table to check against
	 * @returns {*}
	 * @abstract
	 */
	async deleteTable() {
		throw new Error(`[PROVIDERS] ${join(this.dir, ...this.file)} | Missing method 'deleteTable' of ${this.constructor.name}`);
	}

	/**
	 * The hasTable method which checks if a table exists in the database.
	 * @since 0.0.1
	 * @param {string} table The table to check against
	 * @returns {boolean}
	 * @abstract
	 */
	async hasTable() {
		throw new Error(`[PROVIDERS] ${join(this.dir, ...this.file)} | Missing method 'hasTable' of ${this.constructor.name}`);
	}

	/**
	 * Entry Operations
	 */

	/**
	 * The create method which inserts new entries to a table from the database.
	 * @since 0.0.1
	 * @param {string} table The table to update
	 * @param {string} entryID The entry's ID to create
	 * @param {ProviderResolvable} data The data to insert
	 * @returns {*}
	 * @abstract
	 */
	async create() {
		throw new Error(`[PROVIDERS] ${join(this.dir, ...this.file)} | Missing method 'create' of ${this.constructor.name}`);
	}

	/**
	 * The delete method which removes an entries from a table.
	 * @since 0.0.1
	 * @param {string} table The table to update
	 * @param {string} entryID The entry's ID to delete
	 * @returns {*}
	 * @abstract
	 */
	async delete() {
		throw new Error(`[PROVIDERS] ${join(this.dir, ...this.file)} | Missing method 'delete' of ${this.constructor.name}`);
	}

	/**
	 * The get method which retrieves an entry from a table.
	 * @since 0.0.1
	 * @param {string} table The table to update
	 * @param {string} entryID The entry's ID to retrieve
	 * @returns {Object<string, *>}
	 * @abstract
	 */
	async get() {
		throw new Error(`[PROVIDERS] ${join(this.dir, ...this.file)} | Missing method 'get' of ${this.constructor.name}`);
	}

	/**
	 * The getAll method which retrieves all entries from a table.
	 * @since 0.0.1
	 * @param {string} table The table to update
	 * @returns {Array<Object<string, *>>}
	 * @abstract
	 */
	async getAll() {
		throw new Error(`[PROVIDERS] ${join(this.dir, ...this.file)} | Missing method 'getAll' of ${this.constructor.name}`);
	}

	/**
	 * The getKeys method which retrieves all entries' keys from a table.
	 * @since 0.5.0
	 * @param {string} table The table to update
	 * @returns {string[]}
	 * @abstract
	 */
	async getKeys() {
		throw new Error(`[PROVIDERS] ${join(this.dir, ...this.file)} | Missing method 'getKeys' of ${this.constructor.name}`);
	}

	/**
	 * The has method which checks if an entry exists in a table.
	 * @since 0.0.1
	 * @param {string} table The table to update
	 * @param {string} entryID The entry's ID to check against
	 * @returns {boolean}
	 * @abstract
	 */
	async has() {
		throw new Error(`[PROVIDERS] ${join(this.dir, ...this.file)} | Missing method 'has' of ${this.constructor.name}`);
	}

	/**
	 * The removeValue method which edits all entries to remove a property.
	 * @since 0.5.0
	 * @param {string} table The table to update
	 * @param {string} path The path of the property to remove
	 * @returns {*}
	 * @abstract
	 */
	async removeValue() {
		throw new Error(`[PROVIDERS] ${join(this.dir, ...this.file)} | Missing method 'removeValue' of ${this.constructor.name}`);
	}

	/**
	 * The replace method which overwrites the data from an entry.
	 * @since 0.0.1
	 * @param {string} table The table to update
	 * @param {string} entryID The entry's ID to update
	 * @param {ProviderResolvable} data The new data for the entry
	 * @returns {*}
	 * @abstract
	 */
	async replace() {
		throw new Error(`[PROVIDERS] ${join(this.dir, ...this.file)} | Missing method 'replace' of ${this.constructor.name}`);
	}

	/**
	 * The update method which updates an entry from a table.
	 * @since 0.0.1
	 * @param {string} table The table to update
	 * @param {string} entryID The entry's ID to update
	 * @param {ProviderResolvable} data The data to update
	 * @returns {*}
	 * @abstract
	 */
	async update() {
		throw new Error(`[PROVIDERS] ${join(this.dir, ...this.file)} | Missing method 'update' of ${this.constructor.name}`);
	}

	/**
	 * The updateValue method which edits all entries to update or add a property.
	 * @since 0.5.0
	 * @param {string} table The table to update
	 * @param {string} path The path of the property to add/update
	 * @param {*} newValue The new value for the path
	 * @returns {*}
	 * @abstract
	 */
	async updateValue() {
		throw new Error(`[PROVIDERS] ${join(this.dir, ...this.file)} | Missing method 'updateValue' of ${this.constructor.name}`);
	}

	/**
	 * The shutdown method to be optionally overwritten in actual provider pieces.
	 * @since 0.3.0
	 * @returns {*}
	 * @abstract
	 */
	async shutdown() {
		// Optionally defined in extension Classes
	}

	/**
	 * Helper method to abstract the overload parsing to JSON for all NoSQL databases.
	 * @since 0.5.0
	 * @param {ConfigurationUpdateResultEntry[]|Array<Array<string>>|Object<string, *>} data The data to parse
	 * @returns {Object<string, *>}
	 */
	parseInput(data) {
		if (Array.isArray(data)) {
			const [first] = data;
			const output = {};
			if (first.data && first.piece) {
				// [{ data: [string, *], piece: SchemaPiece }, ...]
				for (const entry of data) makeObject(entry.data[0], entry.data[1], output);
				return output;
			}

			if (Array.isArray(first) && first.length === 2) {
				// [[string, *], ...]
				for (const entry of data) makeObject(entry[0], entry[1], output);
				return output;
			}
		} else if (isObject(data)) {
			// Object
			return data;
		}

		throw new TypeError(`The type ${getDeepTypeName(data)} is unsupported. The supported types are ConfigurationUpdateResultEntry[], [string, *][] or Object.`);
	}

	async addColumn() {
		// Reserved for SQL databases
	}

	async removeColumn() {
		// Reserved for SQL databases
	}

}

module.exports = Provider;
