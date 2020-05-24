import { mergeDefault, chunk, mergeObjects } from '@klasa/utils';
import { Provider, ProviderStore } from 'klasa';
import { resolve } from 'path';
import * as fsn from 'fs-nextra';

export default class CoreProvider extends Provider {

	private readonly baseDirectory: string;

	public constructor(store: ProviderStore, directory: string, file: readonly string[]) {
		super(store, directory, file);

		const baseDirectory = resolve(this.client.userBaseDirectory, 'bwd', 'provider', 'json');
		const defaults = mergeDefault({ baseDirectory }, this.client.options.providers.json as { baseDirectory?: string } ?? {});
		this.baseDirectory = defaults.baseDirectory;
	}

	/**
	 * Initializes the database
	 */
	public async init(): Promise<void> {
		await fsn.ensureDir(this.baseDirectory).catch(err => this.client.emit('error', err));
	}

	/* Table methods */

	/**
	 * Checks if a directory exists.
	 * @param table The name of the table you want to check
	 * @returns {Promise<boolean>}
	 */
	public hasTable(table: string): Promise<boolean> {
		return fsn.pathExists(resolve(this.baseDirectory, table));
	}

	/**
	 * Creates a new directory.
	 * @param table The name for the new directory
	 */
	public createTable(table: string): Promise<void> {
		return fsn.mkdir(resolve(this.baseDirectory, table));
	}

	/**
	 * Recursively deletes a directory.
	 * @param table The directory's name to delete
	 */
	public async deleteTable(table: string): Promise<void> {
		const exists = await this.hasTable(table);
		if (exists) {
			await fsn.emptyDir(resolve(this.baseDirectory, table));
			await fsn.remove(resolve(this.baseDirectory, table));
		}
	}

	/* Document methods */

	/**
	 * Get all documents from a directory.
	 * @param table The name of the directory to fetch from
	 * @param entries The entries to download, defaults to all keys in the directory
	 */
	public async getAll(table: string, entries: string[]): Promise<object[]> {
		if (!Array.isArray(entries) || !entries.length) entries = await this.getKeys(table);
		if (entries.length < 5000) {
			return (await Promise.all(entries.map(this.get.bind(this, table)))).filter(value => value) as object[];
		}

		const parts = chunk(entries, 5000);
		const output = [];
		for (const part of parts) output.push(...await Promise.all(part.map(this.get.bind(this, table))));
		return output.filter(value => value) as object[];
	}

	/**
	 * Get all document names from a directory, filter by json.
	 * @param table The name of the directory to fetch from
	 */
	public async getKeys(table: string): Promise<string[]> {
		const dir = resolve(this.baseDirectory, table);
		const filenames = await fsn.readdir(dir);
		const files = [];
		for (const filename of filenames) {
			if (filename.endsWith('.json')) files.push(filename.slice(0, filename.length - 5));
		}
		return files;
	}

	/**
	 * Get a document from a directory.
	 * @param table The name of the directory
	 * @param id The document name
	 */
	public async get(table: string, id: string): Promise<object | null> {
		try {
			return await fsn.readJSON(resolve(this.baseDirectory, table, `${id}.json`));
		} catch {
			return null;
		}
	}

	/**
	 * Check if the document exists.
	 * @param table The name of the directory
	 * @param id The document name
	 */
	public has(table: string, id: string): Promise<boolean> {
		return fsn.pathExists(resolve(this.baseDirectory, table, `${id}.json`));
	}

	/**
	 * Get a random document from a directory.
	 * @param table The name of the directory
	 */
	public async getRandom(table: string): Promise<object | null> {
		const data = await this.getKeys(table);
		return await this.get(table, data[Math.floor(Math.random() * data.length)]);
	}

	/**
	 * Insert a new document into a directory.
	 * @param table The name of the directory
	 * @param id The document name
	 * @param data The object with all properties you want to insert into the document
	 */
	public async create(table: string, id: string, data: object = {}): Promise<void> {
		await fsn.outputJSONAtomic(resolve(this.baseDirectory, table, `${id}.json`), { id, ...this.parseUpdateInput(data) });
	}

	/**
	 * Update a document from a directory.
	 * @param table The name of the directory
	 * @param id The document name
	 * @param data The object with all the properties you want to update
	 */
	public async update(table: string, id: string, data: object): Promise<void> {
		const existent = await this.get(table, id) as Record<PropertyKey, unknown> | null;
		await fsn.outputJSONAtomic(resolve(this.baseDirectory, table, `${id}.json`), mergeObjects(existent ?? { id }, this.parseUpdateInput(data)));
	}

	/**
	 * Replace all the data from a document.
	 * @param table The name of the directory
	 * @param id The document name
	 * @param data The new data for the document
	 */
	public async replace(table: string, id: string, data: object): Promise<void> {
		await fsn.outputJSONAtomic(resolve(this.baseDirectory, table, `${id}.json`), { id, ...this.parseUpdateInput(data) });
	}

	/**
	 * Delete a document from the table.
	 * @param table The name of the directory
	 * @param id The document name
	 */
	public async delete(table: string, id: string): Promise<void> {
		await fsn.unlink(resolve(this.baseDirectory, table, `${id}.json`));
	}

}
