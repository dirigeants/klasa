const Piece = require('./base/Piece');
const { isObject, mergeObjects, makeObject } = require('../util/util');

/**
 * Base class for all Klasa Providers. See {@tutorial CreatingProviders} for more information how to use this class
 * to build custom providers.
 * @tutorial CreatingProviders
 * @extends {Piece}
 */
class Provider extends Piece {

	/**
	 * The createTable method which inserts/creates a new table to the database.
	 * @since 0.0.1
	 * @param {string} table The table to check against
	 * @returns {*}
	 * @abstract
	 */
	async createTable() {
		throw new Error(`[PROVIDERS] ${this.path} | Missing method 'createTable' of ${this.constructor.name}`);
	}

	/**
	 * The deleteTable method which deletes/drops a table from the database.
	 * @since 0.0.1
	 * @param {string} table The table to check against
	 * @returns {*}
	 * @abstract
	 */
	async deleteTable() {
		throw new Error(`[PROVIDERS] ${this.path} | Missing method 'deleteTable' of ${this.constructor.name}`);
	}

	/**
	 * The hasTable method which checks if a table exists in the database.
	 * @since 0.0.1
	 * @param {string} table The table to check against
	 * @returns {boolean}
	 * @abstract
	 */
	async hasTable() {
		throw new Error(`[PROVIDERS] ${this.path} | Missing method 'hasTable' of ${this.constructor.name}`);
	}

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
		throw new Error(`[PROVIDERS] ${this.path} | Missing method 'create' of ${this.constructor.name}`);
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
		throw new Error(`[PROVIDERS] ${this.path} | Missing method 'delete' of ${this.constructor.name}`);
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
		throw new Error(`[PROVIDERS] ${this.path} | Missing method 'get' of ${this.constructor.name}`);
	}

	/**
	 * The getAll method which retrieves all entries from a table.
	 * @since 0.0.1
	 * @param {string} table The table to update
	 * @returns {Array<Object<string, *>>}
	 * @abstract
	 */
	async getAll() {
		throw new Error(`[PROVIDERS] ${this.path} | Missing method 'getAll' of ${this.constructor.name}`);
	}

	/**
	 * The getKeys method which retrieves all entries' keys from a table.
	 * @since 0.5.0
	 * @param {string} table The table to update
	 * @returns {string[]}
	 * @abstract
	 */
	async getKeys() {
		throw new Error(`[PROVIDERS] ${this.path} | Missing method 'getKeys' of ${this.constructor.name}`);
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
		throw new Error(`[PROVIDERS] ${this.path} | Missing method 'has' of ${this.constructor.name}`);
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
		throw new Error(`[PROVIDERS] ${this.path} | Missing method 'replace' of ${this.constructor.name}`);
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
		throw new Error(`[PROVIDERS] ${this.path} | Missing method 'update' of ${this.constructor.name}`);
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

	async addColumn() {
		// Reserved for SQL databases
	}

	async removeColumn() {
		// Reserved for SQL databases
	}

	async updateColumn() {
		// Reserved for SQL databases
	}

	async getColumns() {
		// Reserved for SQL databases
		return [];
	}

	/**
	 * Parse the gateway input for easier operation
	 * @since 0.5.0
	 * @param {(Object<string, *>|SettingsUpdateResult[])} updated The updated entries
	 * @returns {Object<string, *>}
	 * @protected
	 */
	parseUpdateInput(updated) {
		if (isObject(updated)) return updated;
		const updateObject = {};
		for (const entry of updated) mergeObjects(updateObject, makeObject(entry.data[0], entry.data[1]));
		return updateObject;
	}

}

module.exports = Provider;
