import { Provider, ProviderStore } from 'klasa';
export default class CoreProvider extends Provider {
    private readonly baseDirectory;
    constructor(store: ProviderStore, directory: string, file: readonly string[]);
    /**
     * Initializes the database
     */
    init(): Promise<void>;
    /**
     * Checks if a directory exists.
     * @param table The name of the table you want to check
     * @returns {Promise<boolean>}
     */
    hasTable(table: string): Promise<boolean>;
    /**
     * Creates a new directory.
     * @param table The name for the new directory
     */
    createTable(table: string): Promise<void>;
    /**
     * Recursively deletes a directory.
     * @param table The directory's name to delete
     */
    deleteTable(table: string): Promise<void>;
    /**
     * Get all documents from a directory.
     * @param table The name of the directory to fetch from
     * @param entries The entries to download, defaults to all keys in the directory
     */
    getAll(table: string, entries: string[]): Promise<unknown[]>;
    /**
     * Get all document names from a directory, filter by json.
     * @param table The name of the directory to fetch from
     */
    getKeys(table: string): Promise<string[]>;
    /**
     * Get a document from a directory.
     * @param table The name of the directory
     * @param id The document name
     */
    get(table: string, id: string): Promise<unknown | null>;
    /**
     * Check if the document exists.
     * @param table The name of the directory
     * @param id The document name
     */
    has(table: string, id: string): Promise<boolean>;
    /**
     * Get a random document from a directory.
     * @param table The name of the directory
     */
    getRandom(table: string): Promise<unknown | null>;
    /**
     * Insert a new document into a directory.
     * @param table The name of the directory
     * @param id The document name
     * @param data The unknown with all properties you want to insert into the document
     */
    create(table: string, id: string, data?: unknown): Promise<void>;
    /**
     * Update a document from a directory.
     * @param table The name of the directory
     * @param id The document name
     * @param data The unknown with all the properties you want to update
     */
    update(table: string, id: string, data: unknown): Promise<void>;
    /**
     * Replace all the data from a document.
     * @param table The name of the directory
     * @param id The document name
     * @param data The new data for the document
     */
    replace(table: string, id: string, data: unknown): Promise<void>;
    /**
     * Delete a document from the table.
     * @param table The name of the directory
     * @param id The document name
     */
    delete(table: string, id: string): Promise<void>;
}
