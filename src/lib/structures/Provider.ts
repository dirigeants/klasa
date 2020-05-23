import { Piece } from '@klasa/core';
import { isObject, mergeObjects, makeObject } from '@klasa/utils';

/**
 * Base class for all Klasa Providers. See {@tutorial CreatingProviders} for more information how to use this class
 * to build custom providers.
 * @tutorial CreatingProviders
 */
export class Provider extends Piece {

	/**
	 * Inserts or creates a table in the database.
	 * @since 0.0.1
	 * @param {string} table The table to check against
	 * @returns {*}
	 * @abstract
	 */
	public async createTable() {
		throw new Error(`[PROVIDERS] ${this.path} | Missing method 'createTable' of ${this.constructor.name}`);
	}

	/**
	 * Deletes or drops a table from the database.
	 * @since 0.0.1
	 * @param {string} table The table to check against
	 * @returns {*}
	 * @abstract
	 */
	public async deleteTable() {
		throw new Error(`[PROVIDERS] ${this.path} | Missing method 'deleteTable' of ${this.constructor.name}`);
	}

	/**
	 * Checks if a table exists in the database.
	 * @since 0.0.1
	 * @param {string} table The table to check against
	 * @returns {boolean}
	 * @abstract
	 */
	public async hasTable() {
		throw new Error(`[PROVIDERS] ${this.path} | Missing method 'hasTable' of ${this.constructor.name}`);
	}

	/**
	 * Inserts new entries into a table.
	 * @since 0.0.1
	 * @param {string} table The table to update
	 * @param {string} entryID The entry's ID to create
	 * @param {ProviderResolvable} data The data to insert
	 * @returns {*}
	 * @abstract
	 */
	public async create() {
		throw new Error(`[PROVIDERS] ${this.path} | Missing method 'create' of ${this.constructor.name}`);
	}

	/**
	 * Removes entries from a table.
	 * @since 0.0.1
	 * @param {string} table The table to update
	 * @param {string} entryID The ID of the entry to delete
	 * @returns {*}
	 * @abstract
	 */
	public async delete() {
		throw new Error(`[PROVIDERS] ${this.path} | Missing method 'delete' of ${this.constructor.name}`);
	}

	/**
	 * Retrieve a single entry from a table.
	 * @since 0.0.1
	 * @param {string} table The table to query
	 * @param {string} entryID The ID of the entry to retrieve
	 * @returns {Object<string, *>}
	 * @abstract
	 */
	public async get() {
		throw new Error(`[PROVIDERS] ${this.path} | Missing method 'get' of ${this.constructor.name}`);
	}

	/**
	 * Retrieve all entries from a table.
	 * @since 0.0.1
	 * @param {string} table The table to query
	 * @returns {Array<Object<string, *>>}
	 * @abstract
	 */
	public async getAll() {
		throw new Error(`[PROVIDERS] ${this.path} | Missing method 'getAll' of ${this.constructor.name}`);
	}

	/**
	 * Retrieves all entries' keys from a table.
	 * @since 0.5.0
	 * @param {string} table The table to query
	 * @returns {string[]}
	 * @abstract
	 */
	public async getKeys() {
		throw new Error(`[PROVIDERS] ${this.path} | Missing method 'getKeys' of ${this.constructor.name}`);
	}

	/**
	 * Check if an entry exists in a table.
	 * @since 0.0.1
	 * @param {string} table The table to update
	 * @param {string} entryID The entry's ID to check against
	 * @returns {boolean}
	 * @abstract
	 */
	public async has() {
		throw new Error(`[PROVIDERS] ${this.path} | Missing method 'has' of ${this.constructor.name}`);
	}

	/**
	 * Overwrites the data from an entry in a table.
	 * @since 0.0.1
	 * @param {string} table The table to update
	 * @param {string} entryID The entry's ID to update
	 * @param {ProviderResolvable} data The new data for the entry
	 * @returns {*}
	 * @abstract
	 */
	public async replace() {
		throw new Error(`[PROVIDERS] ${this.path} | Missing method 'replace' of ${this.constructor.name}`);
	}

	/**
	 * Updates an entry from a table.
	 * @since 0.0.1
	 * @param {string} table The table to update
	 * @param {string} entryID The entry's ID to update
	 * @param {ProviderResolvable} data The data to update
	 * @returns {*}
	 * @abstract
	 */
	public async update() {
		throw new Error(`[PROVIDERS] ${this.path} | Missing method 'update' of ${this.constructor.name}`);
	}

	/**
	 * The shutdown method to be optionally overwritten in actual provider pieces.
	 * @since 0.3.0
	 * @returns {*}
	 * @abstract
	 */
	public async shutdown() {
		// Optionally defined in extension Classes
	}

	public async addColumn() {
		// Reserved for SQL databases
	}

	public async removeColumn() {
		// Reserved for SQL databases
	}

	public async updateColumn() {
		// Reserved for SQL databases
	}

	public async getColumns() {
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
