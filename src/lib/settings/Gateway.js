const Schema = require('./Schema');
const { resolve } = require('path');
const fs = require('fs-nextra');

class Gateway {

	constructor(store, type, validateFunction, schema, options) {
		this.store = store;
		this.type = type;
		this.options = options;

		this.validate = validateFunction;
		this.defaultSchema = schema;
		this.schema = null;
		this.sql = false;
	}

	init() {
		return Promise.all([
			this.initSchema().then(schema => { this.schema = new Schema(this.client, this, schema, ''); }),
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
			.catch(() => fs.outputJSONAtomic(this.filePath, this.defaultSchema).then(() => this.defaultSchema));
	}

	getEntry(input) {
		if (input === 'default') return this.defaults;
		return this.cache.get(input) || this.defaults;
	}

	async fetchEntry(input) {
		return this.cache.get(input) || this.defaults;
	}

	async createEntry(input, data = this.defaults) {
		const target = await this.validate(target).then(output => output && output.id ? output.id : output);
		await this.provider.create(this.type, target, data);
		await this.cache.set(target, data);
		return true;
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
		await this.cache.set(target, data);
	}

	async reset(target, key, guild = null) {
		guild = this._resolveGuild(guild || target);
		target = await this.validate(target).then(output => output && output.id ? output.id : output);
		const { path, route } = this.getPath(key);
		const parsed = await path.parse(path.default, guild);
		const { result } = await this._reset(target, route, parsed);
		await this.provider.update(this.type, target, result);
		return { value: parsed.data, path };
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

	async updateOne(target, key, value, guild = null) {
		guild = this._resolveGuild(guild || target);
		target = await this.validate(target).then(output => output && output.id ? output.id : output);
		const { parsed, settings, path } = await this._updateOne(target, key, value, guild);
		await this.provider.update(this.type, target, settings);
		return { value: parsed.data, path };
	}

	async _updateOne(target, key, value, guild) {
		const { path, route } = this.getPath(key);
		if (path.array === true) throw `Use Gateway#updateArray instead for this key.`;

		const parsed = await path.parse(value, guild);
		const parsedID = parsed.data && parsed.data.id ? parsed.data.id : parsed.data;
		let cache = await this.fetchEntry(target);
		if (cache.default === true) {
			cache = JSON.parse(JSON.stringify(cache));
			delete cache.default;
		}
		const fullObject = cache;

		for (let i = 0; i < route.length - 1; i++) {
			if (typeof cache[route[i]] === 'undefined') cache[route[i]] = {};
			if (i === route.length) cache[route[i]] = parsedID;
			else cache = cache[route[i]];
		}
		await this.cache.set(target, fullObject);

		return { route, path, result: cache, parsedID, parsed, settings: fullObject };
	}

	async updateArray(target, action, key, value, guild = null) {
		guild = this._resolveGuild(guild || target);
		if (action !== 'add' || action !== 'remove') throw 'The argument \'action\' for Gateway#updateArray only accepts the strings \'add\' and \'remove\'.';
		target = await this.validate(target).then(output => output && output.id ? output.id : output);
		const { parsed, settings, path } = await this._updateArray(target, action, key, value, guild);
		await this.provider.update(this.type, target, settings);
		return { value: parsed.data, path };
	}

	async _updateArray(target, action, key, value, guild) {
		const { path, route } = this.getPath(key);
		if (path.array === false) throw `Use Gateway#updateOne instead for this key.`;

		const parsed = await path.parse(value, guild);
		const parsedID = parsed.data && parsed.data.id ? parsed.data.id : parsed.data;
		let cache = await this.fetchEntry(target);
		if (cache.default === true) {
			cache = JSON.parse(JSON.stringify(cache));
			delete cache.default;
		}
		const fullObject = cache;

		for (let i = 0; i < route.length - 1; i++) {
			if (typeof cache[route[i]] === 'undefined') cache[route[i]] = {};
			cache = cache[route[i]];
		}
		if (action === 'add') {
			if (cache.includes(parsedID)) throw `The value ${parsedID} for the key ${path.path} already exists.`;
			cache.push(parsedID);
		} else {
			const index = cache.indexOf(parsedID);
			if (index === -1) throw `The value ${parsedID} for the key ${path.path} does not exist.`;
			cache.splice(index, 1);
		}

		await this.cache.set(target, fullObject);

		return { route, path, result: cache, parsedID, parsed, settings: fullObject };
	}

	getPath(key) {
		const route = key.split('.');
		let path = this.schema;

		for (let i = 0; i < route.length; i++) {
			if (path.keys.has(route[i]) === false) throw `The key ${route.slice(0, i).join('.')} does not exist in the current schema.`;
			path = path[route[i]];
		}

		if (path.type === 'Folder') throw `Please, choose one of the following keys: '${Object.keys(path).join('\', \'')}'`;
		return { path, route };
	}

	_resolveGuild(guild) {
		const constName = guild.constructor.name;
		if (constName === 'Guild') return guild;
		if (constName === 'TextChannel' || constName === 'VoiceChannel' || constName === 'Message' || constName === 'Role') return guild.guild;
		if (typeof guild === 'string' && /^\d{17,19}$/.test(guild)) return this.client.guilds.get(guild);
		return null;
	}

	get cache() {
		return this.options.cache.getTable(this.type);
	}

	get provider() {
		return this.options.provider;
	}

	get defaults() {
		return Object.assign(this.schema.defaults, { default: true });
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
