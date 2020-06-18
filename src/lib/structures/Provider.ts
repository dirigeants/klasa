import { Piece } from '@klasa/core';

import type { SchemaEntry } from '../settings/schema/SchemaEntry';
import type { SettingsUpdateResults } from '../settings/Settings';

export abstract class Provider extends Piece {

	/**
	 * Inserts or creates a table in the database.
	 * @param table The table to check against
	 * @param rows The rows to insert
	 */
	public abstract createTable(table: string, rows?: readonly [string, string][]): Promise<unknown>;

	/**
	 * Deletes or drops a table from the database.
	 * @param table The table to check against
	 */
	public abstract deleteTable(table: string): Promise<unknown>;

	/**
	 * Checks if a table exists in the database.
	 * @param table The table to check against
	 */
	public abstract hasTable(table: string): Promise<boolean>;

	/**
	 * Inserts new entry into a table.
	 * @param table The table to update
	 * @param entry The entry's ID to create
	 * @param data The data to insert
	 */
	public abstract create(table: string, entry: string, data: unknown | SettingsUpdateResults): Promise<unknown>;

	/**
	 * Removes entries from a table.
	 * @param table The table to update
	 * @param entry The ID of the entry to delete
	 */
	public abstract delete(table: string, entry: string): Promise<unknown>;

	/**
	 * Retrieve a single entry from a table.
	 * @param table The table to query
	 * @param entry The ID of the entry to retrieve
	 */
	public abstract get(table: string, entry: string): Promise<unknown | null>;

	/**
	 * Retrieve all entries from a table.
	 * @param table The table to query
	 * @param entries The ids to retrieve from the table
	 */
	public abstract getAll(table: string, entries?: readonly string[]): Promise<unknown[]>;

	/**
	 * Retrieves all entries' keys from a table.
	 * @param table The table to query
	 */
	public abstract getKeys(table: string): Promise<string[]>;

	/**
	 * Check if an entry exists in a table.
	 * @param table The table to update
	 * @param entry The entry's ID to check against
	 */
	public abstract has(table: string, entry: string): Promise<boolean>;

	/**
	 * Updates an entry from a table.
	 * @param table The table to update
	 * @param entry The entry's ID to update
	 * @param data The data to update
	 */
	public abstract update(table: string, entry: string, data: unknown | SettingsUpdateResults): Promise<unknown>;

	/**
	 * Overwrites the data from an entry in a table.
	 * @param table The table to update
	 * @param entry The entry's ID to update
	 * @param data The new data for the entry
	 */
	public abstract replace(table: string, entry: string, data: unknown | SettingsUpdateResults): Promise<unknown>;

	/**
	 * Shutdown method, this is called before the piece is unloaded.
	 */
	public shutdown(): unknown {
		// Optionally defined in extension Classes
		return undefined;
	}

	/**
	 * The addColumn method which inserts/creates a new table to the database.
	 * @param table The table to check against
	 * @param entry The SchemaEntry added to the schema
	 */
	/* istanbul ignore next: Implemented in SQLProvider, always unused. */
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public async addColumn(_table: string, _entry: SchemaEntry): Promise<unknown> {
		// Reserved for SQL databases
		return undefined;
	}

	/**
	 * The removeColumn method which inserts/creates a new table to the database.
	 * @since 0.5.0
	 * @param table The table to check against
	 * @param columns The column names to remove
	 */
	/* istanbul ignore next: Implemented in SQLProvider, always unused. */
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public async removeColumn(_table: string, _columns: readonly string[]): Promise<unknown> {
		// Reserved for SQL databases
		return undefined;
	}

	/**
	 * The updateColumn method which alters the datatype from a column.
	 * @param table The table to check against
	 * @param entry The modified SchemaEntry
	 */
	/* istanbul ignore next: Implemented in SQLProvider, always unused. */
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public async updateColumn(_table: string, _entry: SchemaEntry): Promise<unknown> {
		// Reserved for SQL databases
		return undefined;
	}

	/**
	 * The getColumns method which gets the name of all columns.
	 * @param table The table to check against
	 */
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public async getColumns(_table: string): Promise<string[]> {
		// Reserved for SQL databases
		return [];
	}

	/**
	 * Process the input from {@link Settings#update} or {@link Settings#reset} into a plain unknown that can be used for
	 * document-based database drivers. If it receives a non-array, it returns the value without further processing.
	 * @param changes The data that has been updated
	 */
	protected parseUpdateInput(changes: unknown | SettingsUpdateResults): Record<PropertyKey, unknown> {
		if (!Array.isArray(changes)) return changes as Record<PropertyKey, unknown>;

		return Object.fromEntries(changes.map(change => [change.entry.key, change.next]));
	}

}
