"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@klasa/utils");
const klasa_1 = require("klasa");
const path_1 = require("path");
const fs_1 = require("fs");
const fsn = require("fs-nextra");
class CoreProvider extends klasa_1.Provider {
    constructor(store, directory, file) {
        var _a;
        super(store, directory, file);
        const baseDirectory = path_1.resolve(this.client.userBaseDirectory, 'bwd', 'provider', 'json');
        const defaults = utils_1.mergeDefault({ baseDirectory }, (_a = this.client.options.providers.json) !== null && _a !== void 0 ? _a : {});
        this.baseDirectory = defaults.baseDirectory;
    }
    /**
     * Initializes the database
     */
    async init() {
        await fsn.ensureDir(this.baseDirectory).catch(err => this.client.emit('error', err));
    }
    /* Table methods */
    /**
     * Checks if a directory exists.
     * @param table The name of the table you want to check
     * @returns {Promise<boolean>}
     */
    hasTable(table) {
        return fsn.pathExists(path_1.resolve(this.baseDirectory, table));
    }
    /**
     * Creates a new directory.
     * @param table The name for the new directory
     */
    createTable(table) {
        return fs_1.promises.mkdir(path_1.resolve(this.baseDirectory, table));
    }
    /**
     * Recursively deletes a directory.
     * @param table The directory's name to delete
     */
    async deleteTable(table) {
        const exists = await this.hasTable(table);
        if (exists) {
            await fsn.emptyDir(path_1.resolve(this.baseDirectory, table));
            await fsn.remove(path_1.resolve(this.baseDirectory, table));
        }
    }
    /* Document methods */
    /**
     * Get all documents from a directory.
     * @param table The name of the directory to fetch from
     * @param entries The entries to download, defaults to all keys in the directory
     */
    async getAll(table, entries) {
        if (!Array.isArray(entries) || !entries.length)
            entries = await this.getKeys(table);
        if (entries.length < 5000) {
            return (await Promise.all(entries.map(this.get.bind(this, table)))).filter(value => value);
        }
        const parts = utils_1.chunk(entries, 5000);
        const output = [];
        for (const part of parts)
            output.push(...await Promise.all(part.map(this.get.bind(this, table))));
        return output.filter(value => value);
    }
    /**
     * Get all document names from a directory, filter by json.
     * @param table The name of the directory to fetch from
     */
    async getKeys(table) {
        const dir = path_1.resolve(this.baseDirectory, table);
        const filenames = await fs_1.promises.readdir(dir);
        const files = [];
        for (const filename of filenames) {
            if (filename.endsWith('.json'))
                files.push(filename.slice(0, filename.length - 5));
        }
        return files;
    }
    /**
     * Get a document from a directory.
     * @param table The name of the directory
     * @param id The document name
     */
    async get(table, id) {
        try {
            return await fsn.readJSON(path_1.resolve(this.baseDirectory, table, `${id}.json`));
        }
        catch {
            return null;
        }
    }
    /**
     * Check if the document exists.
     * @param table The name of the directory
     * @param id The document name
     */
    has(table, id) {
        return fsn.pathExists(path_1.resolve(this.baseDirectory, table, `${id}.json`));
    }
    /**
     * Get a random document from a directory.
     * @param table The name of the directory
     */
    async getRandom(table) {
        const data = await this.getKeys(table);
        return await this.get(table, data[Math.floor(Math.random() * data.length)]);
    }
    /**
     * Insert a new document into a directory.
     * @param table The name of the directory
     * @param id The document name
     * @param data The unknown with all properties you want to insert into the document
     */
    async create(table, id, data = {}) {
        await fsn.outputJSONAtomic(path_1.resolve(this.baseDirectory, table, `${id}.json`), { id, ...this.parseUpdateInput(data) });
    }
    /**
     * Update a document from a directory.
     * @param table The name of the directory
     * @param id The document name
     * @param data The unknown with all the properties you want to update
     */
    async update(table, id, data) {
        const existent = await this.get(table, id);
        await fsn.outputJSONAtomic(path_1.resolve(this.baseDirectory, table, `${id}.json`), utils_1.mergeObjects(existent !== null && existent !== void 0 ? existent : { id }, this.parseUpdateInput(data)));
    }
    /**
     * Replace all the data from a document.
     * @param table The name of the directory
     * @param id The document name
     * @param data The new data for the document
     */
    async replace(table, id, data) {
        await fsn.outputJSONAtomic(path_1.resolve(this.baseDirectory, table, `${id}.json`), { id, ...this.parseUpdateInput(data) });
    }
    /**
     * Delete a document from the table.
     * @param table The name of the directory
     * @param id The document name
     */
    async delete(table, id) {
        await fs_1.promises.unlink(path_1.resolve(this.baseDirectory, table, `${id}.json`));
    }
}
exports.default = CoreProvider;
//# sourceMappingURL=json.js.map