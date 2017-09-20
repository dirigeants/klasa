const SchemaManager = require('./SchemaManager');
const SQL = require('./SQL');

/**
 * The gateway to all settings
 * @extends {SchemaManager}
 */
class SettingGateway extends SchemaManager {

	/**
	 * @param {SettingCache} store The SettingCache instance which initiated this SettingGateway
	 * @param {string} type The name of this instance of SettingGateway.
	 * @param {Function} validateFunction The function validator for this instance of SettingGateway
	 * @param {Object} schema The schema for this instance of SettingGateway
	 */
	constructor(store, type, validateFunction, schema) {
		super(store.client);

		/**
		 * The SettingCache instance which initiated this SettingGateway.
		 * @name SettingGateway#store
		 * @type {SettingCache}
		 * @readonly
		 */
		Object.defineProperty(this, 'store', { value: store });

		/**
		 * The name of this instance of SettingGateway. The schema will be saved under 'name_Schema.json'.
		 * @name SettingGateway#type
		 * @type {string}
		 */
		this.type = type;

		/**
		 * The provider engine this instance of SettingGateway should use to handle your settings.
		 * @name SettingGateway#engine
		 * @type {string}
		 */
		this.engine = this.client.config.provider.engine || 'json';

		if (!this.provider) throw `This provider (${this.engine}) does not exist in your system.`;

		/**
		 * If the provider is SQL, this property is on charge to serialize/deserialize.
		 * @name SettingGateway#sql
		 * @type {?SQL}
		 */
		this.sql = this.provider.sql ? new SQL(this.client, this) : null;

		/**
		 * The function validator for this instance of SettingGateway.
		 * @name SettingGateway#validate
		 * @type {function}
		 */
		this.validate = validateFunction;

		/**
		 * The schema for this instance of SettingGateway.
		 * @name SettingGateway#defaultDataSchema
		 * @type {object}
		 */
		this.defaultDataSchema = schema;
	}

	/**
	 * Initialize the configuration for this gateway.
	 * @returns {void}
	 */
	async init() {
		await this.initSchema();
		const hasTable = await this.provider.hasTable(this.type);
		if (!hasTable) {
			const SQLCreate = this.sql ? this.sql.buildSQLSchema(this.schema) : undefined;
			await this.provider.createTable(this.type, SQLCreate);
		}
		const data = await this.provider.getAll(this.type);
		if (this.sql) {
			this.sql.initDeserialize();
			for (let i = 0; i < data.length; i++) this.sql.deserializer(data[i]);
		}
		if (data[0]) for (const key of data) super.set(key.id, key);
	}

	/**
	 * Create a new entry in the configuration.
	 * @param {Object|string} input An object containing a id property, like discord.js objects, or a string.
	 * @returns {void}
	 */
	async create(input) {
		const target = await this.validate(input).then(output => output.id || output);
		await this.provider.create(this.type, target, this.defaults);
		super.set(target, this.defaults);
	}

	/**
	 * Remove an entry from the configuration.
	 * @param {string} input A key to delete from the cache.
	 * @returns {void}
	 */
	async destroy(input) {
		await this.provider.delete(this.type, input);
		super.delete(this.type, input);
	}

	/**
	 * Get an entry from the cache.
	 * @param {string} input A key to get the value for.
	 * @returns {Object}
	 */
	get(input) {
		if (input === 'default') return this.defaults;
		return super.get(input) || this.defaults;
	}

	/**
	 * Updates an entry.
	 * @param {(Object|string)} input An object containing a id property, like Discord.js objects, or a string.
	 * @param {external:Guild} [guild=null] A Guild resolvable, useful for when the instance of SG doesn't aim for Guild settings.
	 * @returns {Object}
	 */
	async getResolved(input, guild = null) {
		const target = await this.validate(input).then(output => output.id || output);
		guild = await this._resolveGuild(guild || target);

		let settings = this.get(target);
		if (settings instanceof Promise) settings = await settings;
		const resolved = await Promise.all(Object.entries(settings).map(([key, data]) => {
			const { min, max, type } = this.schema[key] || {};
			if (this.schema[key] && this.schema[key].array) return { [key]: Promise.all(data.map(entry => this.resolver[type.toLowerCase()](entry, guild, key, { min, max }))) };
			return { [key]: this.schema[key] && data ? this.resolver[type.toLowerCase()](data, guild, this.schema[key], { min, max }) : data };
		}));
		return Object.assign({}, ...resolved);
	}

	/**
	 * Sync either all entries from the configuration, or a single one.
	 * @name SettingGateway#sync
	 * @param {(Object|string)} [input=null] An object containing a id property, like discord.js objects, or a string.
	 * @returns {void}
	 */
	async sync(input = null) {
		if (!input) {
			const data = await this.provider.getAll(this.type);
			if (this.sql) for (let i = 0; i < data.length; i++) this.sql.deserializer(data[i]);
			for (const key of data) super.set(key.id, key);
			return;
		}
		const target = await this.validate(input).then(output => output.id || output);
		const data = await this.provider.get(this.type, target);
		if (this.sql) this.sql.deserializer(data);
		await super.set(target, data);
	}

	/**
	 * Reset a key's value to default from a entry.
	 * @param {(Object|string)} input An object containing a id property, like Discord.js objects, or a string.
	 * @param {string} key The key to reset.
	 * @returns {any}
	 */
	async reset(input, key) {
		const target = await this.validate(input).then(output => output.id || output);
		if (!(key in this.schema)) throw `The key ${key} does not exist in the current data schema.`;
		const defaultKey = this.schema[key].default;
		const clone = Object.assign({}, this.get(target));
		this.client.emit('settingUpdate', this, target, { [key]: clone[key] }, { [key]: defaultKey });
		await this.provider.update(this.type, target, { [key]: defaultKey });
		await this.sync(target);
		return defaultKey;
	}

	/**
	 * Updates an entry.
	 * @param {(Object|string)} input An object or string that can be parsed by this instance's resolver.
	 * @param {Object} object An object with pairs of key/value to update.
	 * @param {(Object|string)} [guild=null] A Guild resolvable, useful for when the instance of SG doesn't aim for Guild settings.
	 * @returns {Object}
	 */
	async update(input, object, guild = null) {
		const target = await this.validate(input).then(output => output.id || output);
		guild = await this._resolveGuild(guild || target);

		const resolved = await Promise.all(Object.entries(object).map(async ([key, value]) => {
			if (!(key in this.schema)) throw `The key ${key} does not exist in the current data schema.`;
			const { min, max, type } = this.schema[key];
			return this.resolver[type.toLowerCase()](value, guild, key, { min, max })
				.then(res => ({ [key]: res.id || res }));
		}));

		const result = Object.assign({}, ...resolved);

		await this.ensureCreate(target);
		const clone = Object.assign({}, this.get(target));
		this.client.emit('settingUpdate', this, target, Object.assign({}, ...Object.keys(result).map(key => ({ [key]: clone[key] }))), result);
		await this.provider.update(this.type, target, result);
		await this.sync(target);
		return result;
	}

	/**
	 * Creates the settings if it did not exist previously.
	 * @param {(Object|string)} target An object or string that can be parsed by this instance's resolver.
	 * @returns {true}
	 */
	async ensureCreate(target) {
		if (typeof target !== 'string') throw `Expected input type string, got ${typeof target}`;
		let cache = this.get(target);
		if (cache instanceof Promise) cache = await cache;
		if (!('id' in cache)) return this.create(target);
		return true;
	}

	/**
	 * Update an array from the configuration.
	 * @param {Object|string} input An object containing a id property, like discord.js objects, or a string.
	 * @param {('add'|'remove')} action Either 'add' or 'remove'.
	 * @param {string} key The key from the Schema.
	 * @param {any} data The value to be added or removed.
	 * @returns {boolean}
	 */
	async updateArray(input, action, key, data) {
		if (!['add', 'remove'].includes(action)) throw 'The type parameter must be either add or remove.';
		if (!(key in this.schema)) throw `The key ${key} does not exist in the current data schema.`;
		if (!this.schema[key].array) throw `The key ${key} is not an Array.`;
		if (data === undefined) throw 'You must specify the value to add or filter.';
		const target = await this.validate(input).then(output => output.id || output);
		const { min, max, type } = this.schema[key];
		let result = await this.resolver[type.toLowerCase()](data, this.client.guilds.get(target), key, { min, max });
		if (result.id) result = result.id;
		let cache = this.get(target);
		if (cache instanceof Promise) cache = await cache;
		if (action === 'add') {
			if (cache[key].includes(result)) throw `The value ${data} for the key ${key} already exists.`;
			cache[key].push(result);
			await this.provider.update(this.type, target, { [key]: cache[key] });
			await this.sync(target);
			return result;
		}
		if (!cache[key].includes(result)) throw `The value ${data} for the key ${key} does not exist.`;
		cache[key] = cache[key].filter(ent => ent !== result);

		await this.ensureCreate(target);
		const clone = Object.assign({}, this.get(target));
		this.client.emit('settingUpdate', this, target, { [key]: clone[key] }, { [key]: cache[key] });
		await this.provider.update(this.type, target, { [key]: cache[key] });
		await this.sync(target);
		return true;
	}

	_resolveGuild(guild) {
		const constName = guild.constructor.name;
		if (constName === 'Guild') return guild;
		if (constName === 'TextChannel' || constName === 'VoiceChannel' || constName === 'Message' || constName === 'Role') return guild.guild;
		if (typeof guild === 'string' && /^\d{17,19}$/.test(guild)) return this.client.guilds.get(guild);
		return null;
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

	/**
	 * The provider this SettingGateway instance uses for the persistent data operations.
	 * @type {Provider}
	 * @readonly
	 */
	get provider() {
		return this.client.providers.get(this.engine);
	}

}

module.exports = SettingGateway;
