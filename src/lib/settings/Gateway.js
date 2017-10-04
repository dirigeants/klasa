const Schema = require('./Schema');
const { resolve } = require('path');
const fs = require('fs-nextra');

class Gateway {

	constructor(store, type, validateFunction, schema, options) {
		this.store = store;
		this.type = type;
		this.options = options;

		this.validate = validateFunction;
		this.schema = new Schema(this.client, this, schema, '');
		this.sql = false;
	}

	async init() {
		return Promise.all([
			this.initSchema(),
			this.initTable()
		]);
	}

	async initTable() {
		const hasTable = await this.provider.hasTable(this.type);
		if (!hasTable) await this.provider.createTable(this.type);

		const data = await this.provider.getAll(this.type);
		if (data.length > 0) for (const key of data) this.cache.set(key.id, key);
	}

	async initSchema() {
		const baseDir = resolve(this.client.clientBaseDir, 'bwd');
		await fs.ensureDir(baseDir);
		this.filePath = resolve(baseDir, `${this.type}_Schema.json`);
		return fs.readJSON(this.filePath)
			.catch(() => fs.outputJSONAtomic(this.filePath, this.schema.toJSON()));
	}

	getEntry(input) {
		if (input === 'default') return this.defaults;
		return this.cache.get(input) || this.defaults;
	}

	async fetchEntry(input) {
		return this.cache.get(input) || this.defaults;
	}

	async deleteEntry(input) {
		await this.provider.delete(this.type, input);
		this.cache.delete(this.type, input);
		return true;
	}

	async sync(input = null) {
		if (!input) {
			const data = await this.provider.getAll(this.type);
			if (data.length > 0) for (const key of data) this.cache.set(key.id, key);
			return;
		}
		const target = await this.validate(target).then(output => output && output.id ? output.id : output);
		const data = await this.provider.get(this.type, target);
		await super.set(target, data);
	}

	async reset(target, key, guild) {
		target = await this.validate(target).then(output => output && output.id ? output.id : output);
		const { path, route } = this._getPath(key);
		const parsed = await path.parse(path.default, guild);
		const { result } = await this._reset(target, route, parsed);
		await this.provider.update(this.type, target, result);
		return parsed;
	}

	async _reset(target, route, parsed) {
		let cache = await this.fetchEntry(target);
		const parsedID = parsed && parsed.id ? parsed.id : parsed;
		for (let i = 0; i < route.length; i++) {
			if (typeof cache[route[i]] === 'undefined') cache[route[i]] = {};
			if (i === route.length - 1) cache[route[i]] = parsedID;
			else cache = cache[route[i]];
		}

		return { result: cache, parsedID };
	}

	async updateOne(target, key, value, guild) {
		target = await this.validate(target).then(output => output && output.id ? output.id : output);
		const { parsed, result } = await this._updateOne(target, key, value, guild);
		await this.provider.update(this.type, target, result);
		return parsed;
	}

	async _updateOne(target, key, value, guild) {
		const { path, route } = this._getPath(key);

		const parsed = await path.parse(value, guild);
		const parsedID = parsed && parsed.id ? parsed.id : parsed;
		let cache = await this.fetchEntry(target);
		for (let i = 0; i < route.length; i++) {
			if (typeof cache[route[i]] === 'undefined') cache[route[i]] = {};
			if (i === route.length - 1) cache[route[i]] = parsedID;
			else cache = cache[route[i]];
		}

		return { route, path, result: cache, parsedID, parsed };
	}

	_getPath(key) {
		const route = key.split('.');
		let path = this.schema;

		for (let i = 0; i < route.length; i++) {
			if (path.keys.has(path[route[i]]) === false) throw `The key ${route.slice(0, i).join('.')} does not exist in the current schema.`;
			path = path[route[i]];
		}

		if (path.type === 'Folder') throw `Please, choose one of the following keys: '${Object.keys(path).join('\', \'')}'`;
		return { path, route };
	}

	get cache() {
		return this.options.cache;
	}

	get provider() {
		return this.options.provider;
	}

	get defaults() {
		return this.schema.defaults;
	}

	/**
	 * The client this SettingGateway was created with.
	 * @type {KlasaClient}
	 * @readonly
	 */
	get client() {
		return this.store.client;
	}

	/**
	 * The resolver instance this SettingGateway uses to parse the data.
	 * @type {Resolver}
	 * @readonly
	 */
	get resolver() {
		return this.store.resolver;
	}

}

module.exports = Gateway;
