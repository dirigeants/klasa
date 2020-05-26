import { Provider } from './Provider';
import type { SchemaFolder } from '../settings/schema/SchemaFolder';
import type { SchemaEntry } from '../settings/schema/SchemaEntry';
import type { SettingsUpdateResults } from '../settings/SettingsFolder';
import type { QueryBuilder } from '../util/QueryBuilder';
export declare abstract class SQLProvider extends Provider {
    /**
     * The QueryBuilder instance for this SQL provider
     */
    abstract qb: QueryBuilder;
    /**
     * Inserts or creates a table in the database.
     * @param table The table to check against
     * @param rows The rows to insert
     */
    abstract createTable(table: string, rows?: readonly [string, string][]): Promise<unknown>;
    /**
     * Deletes or drops a table from the database.
     * @param table The table to check against
     */
    abstract deleteTable(table: string): Promise<unknown>;
    /**
     * Checks if a table exists in the database.
     * @param table The table to check against
     */
    abstract hasTable(table: string): Promise<boolean>;
    /**
     * Inserts new entry into a table.
     * @param table The table to update
     * @param entry The entry's ID to create
     * @param data The data to insert
     */
    abstract create(table: string, entry: string, data: unknown): Promise<unknown>;
    /**
     * Removes entries from a table.
     * @param table The table to update
     * @param entry The ID of the entry to delete
     */
    abstract delete(table: string, entry: string): Promise<unknown>;
    /**
     * Retrieve a single entry from a table.
     * @param table The table to query
     * @param entry The ID of the entry to retrieve
     */
    abstract get(table: string, entry: string): Promise<unknown | null>;
    /**
     * Retrieve all entries from a table.
     * @param table The table to query
     * @param entries The ids to retrieve from the table
     */
    abstract getAll(table: string, entries?: readonly string[]): Promise<unknown[]>;
    /**
     * Retrieves all entries' keys from a table.
     * @param table The table to query
     */
    abstract getKeys(table: string): Promise<string[]>;
    /**
     * Check if an entry exists in a table.
     * @param table The table to update
     * @param entry The entry's ID to check against
     */
    abstract has(table: string, entry: string): Promise<boolean>;
    /**
     * Updates an entry from a table.
     * @param table The table to update
     * @param entry The entry's ID to update
     * @param data The data to update
     */
    abstract update(table: string, entry: string, data: unknown): Promise<unknown>;
    /**
     * Overwrites the data from an entry in a table.
     * @param table The table to update
     * @param entry The entry's ID to update
     * @param data The new data for the entry
     */
    abstract replace(table: string, entry: string, data: unknown): Promise<unknown>;
    /**
     * The addColumn method which inserts/creates a new table to the database.
     * @param table The table to check against
     * @param entry The SchemaFolder or SchemaEntry added to the schema
     */
    abstract addColumn(table: string, entry: SchemaFolder | SchemaEntry): Promise<unknown>;
    /**
     * The removeColumn method which inserts/creates a new table to the database.
     * @since 0.5.0
     * @param table The table to check against
     * @param columns The column names to remove
     */
    abstract removeColumn(table: string, columns: readonly string[]): Promise<unknown>;
    /**
     * The updateColumn method which alters the datatype from a column.
     * @param table The table to check against
     * @param entry The modified SchemaEntry
     */
    abstract updateColumn(table: string, entry: SchemaEntry): Promise<unknown>;
    /**
     * The getColumns method which gets the name of all columns.
     * @param table The table to check against
     */
    abstract getColumns(table: string): Promise<string[]>;
    /**
     * The query builder debug check for errors in the QueryBuilder, if one exists in the extended SQLProvider instance
     */
    init(): Promise<void>;
    /**
     * Process the input from {@link Settings#update} or {@link Settings#reset} into an unknown with the keys and values
     * that can be used for schema-based (SQL) database drivers. If it receives a non-array, it is flattened into a
     * dotted unknown notation. Please note that this behaviour may be tricky when working with a {@link SchemaEntry}
     * which type accepts an unknown and it's not an array, as it'll be flattened into as many keys as properties it has.
     */
    protected parseTupleUpdateInput(changes: unknown | SettingsUpdateResults): SqlProviderParsedTupleUpdateInput;
}
export interface SqlProviderParsedTupleUpdateInput {
    keys: string[];
    values: unknown[];
}
