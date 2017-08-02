const { Guild } = require('discord.js');
const SettingResolver = require('../parsers/SettingResolver');
const CacheManager = require('./CacheManager');
const SchemaManager = require('./SchemaManager');
const SQL = require('./SQL');

/**
 * The gateway to all settings
 * @extends {CacheManager}
 */
class SettingGateway extends CacheManager {

	/**
	 * @param {KlasaClient} client The Klasa Client
	 */
	constructor(client) {
		super(client);

		/** @type {Client} */
		this.client = client;

		/** @type {string} */
		this.engine = client.config.provider.engine || 'json';

		this.resolver = new SettingResolver(client);
		this.schemaManager = new SchemaManager(this.client);
	}

	/**
	 * Initialize the configuration for all Guilds.
	 * @returns {void}
	 */
	async init() {
		if (!this.provider) throw `This provider (${this.engine}) does not exist in your system.`;
		await this.schemaManager.init();
		this.sql = this.provider.sql ? new SQL(this.client, this.provider) : false;
		if (!await this.provider.hasTable('guilds')) {
			const SQLCreate = this.sql ? this.sql.buildSQLSchema(this.schema) : undefined;
			await this.provider.createTable('guilds', SQLCreate);
		}
		const data = await this.provider.getAll('guilds');
		if (this.sql) {
			this.sql.initDeserialize();
			for (let i = 0; i < data.length; i++) this.sql.deserializer(data[i]);
		}
		if (data[0]) for (const key of data) super.set(key.id, key);
	}

	/**
	 * Get the current provider.
	 * @readonly
	 * @returns {Provider}
	 */
	get provider() {
		return this.client.providers.get(this.engine);
	}

	/**
	 * Get the current DataSchema.
	 * @readonly
	 * @returns {Object}
	 */
	get schema() {
		return this.schemaManager.schema;
	}

	/**
	 * Get the default values from the current DataSchema.
	 * @readonly
	 * @returns {Object}
	 */
	get defaults() {
		return this.schemaManager.defaults;
	}

	/**
	 * Create a new Guild entry for the configuration.
	 * @param {Guild|Snowflake} guild The Guild object or snowflake.
	 * @returns {void}
	 */
	async create(guild) {
		const target = await this.validateGuild(guild);
		await this.provider.create('guilds', target.id, this.schemaManager.defaults);
		super.set(target.id, this.schemaManager.defaults);
	}

	/**
	 * Remove a Guild entry from the configuration.
	 * @param {Snowflake} guild The Guild object or snowflake.
	 * @returns {void}
	 */
	async destroy(guild) {
		await this.provider.delete('guilds', guild);
		super.delete('guilds', guild);
	}

	/**
	 * Get a Guild entry from the configuration.
	 * @param {(Guild|Snowflake)} guild The Guild object or snowflake.
	 * @returns {Object}
	 */
	get(guild) {
		if (guild === 'default') return this.schemaManager.defaults;
		return super.get(guild) || this.schemaManager.defaults;
	}

	/**
	 * Get a Resolved Guild entry from the configuration.
	 * @param {(Guild|Snowflake)} guild The Guild object or snowflake.
	 * @returns {Object}
	 */
	async getResolved(guild) {
		guild = await this.validateGuild(guild);
		const settings = this.get(guild.id);
		const resolved = await Promise.all(Object.entries(settings).map(([key, data]) => {
			if (this.schema[key] && this.schema[key].array) return { [key]: Promise.all(data.map(entry => this.resolver[this.schema[key].type.toLowerCase()](entry, guild, key, this.schema[key]))) };
			return { [key]: this.schema[key] && data ? this.resolver[this.schema[key].type.toLowerCase()](data, guild, key, this.schema[key]) : data };
		}));
		return Object.assign({}, ...resolved);
	}

	/**
	 * Sync either all Guild entries from the configuration, or a single one.
	 * @param {(Guild|Snowflake)} [guild=null] The configuration for the selected Guild, if specified.
	 * @returns {void}
	 */
	async sync(guild = null) {
		if (!guild) {
			const data = await this.provider.getAll('guilds');
			if (this.sql) for (let i = 0; i < data.length; i++) this.sql.deserializer(data[i]);
			for (const key of data) super.set(key.id, key);
			return;
		}
		const target = await this.validateGuild(guild);
		const data = await this.provider.get('guilds', target.id);
		if (this.sql) this.sql.deserializer(data);
		await super.set(target.id, data);
	}

	/**
	 * Reset a key's value to default from a Guild configuration.
	 * @param {(Guild|Snowflake)} guild The Guild object or snowflake.
	 * @param {string} key The key to reset.
	 * @returns {*}
	 */
	async reset(guild, key) {
		const target = await this.validateGuild(guild);
		if (!(key in this.schema)) throw guild.language.get('SETTING_GATEWAY_KEY_NOEXT', key);
		const defaultKey = this.schema[key].default;
		await this.provider.update('guilds', target.id, { [key]: defaultKey });
		this.sync(target.id);
		return defaultKey;
	}

	/**
	 * Update a Guild's configuration.
	 * @param {(Guild|Snowflake)} guild The Guild object or snowflake.
	 * @param {string} key The key to update.
	 * @param {any} data The new value for the key.
	 * @returns {any}
	 */
	async update(guild, key, data) {
		if (!(key in this.schema)) throw guild.language.get('SETTING_GATEWAY_KEY_NOEXT', key);
		const target = await this.validateGuild(guild);
		let result = await this.resolver[this.schema[key].type.toLowerCase()](data, target, key, this.schema[key]);
		if (result.id) result = result.id;
		await this.provider.update('guilds', target.id, { [key]: result });
		await this.sync(target.id);
		return result;
	}

	/**
	 * Update an array from the a Guild's configuration.
	 * @param {(Guild|Snowflake)} guild The Guild object or snowflake.
	 * @param {string} type Either 'add' or 'remove'.
	 * @param {string} key The key from the Schema.
	 * @param {any} data The value to be added or removed.
	 * @returns {boolean}
	 */
	async updateArray(guild, type, key, data) {
		if (!['add', 'remove'].includes(type)) throw guild.language.get('SETTING_GATEWAY_INVALID_TYPE');
		if (!(key in this.schema)) throw guild.language.get('SETTING_GATEWAY_KEY_NOEXT', key);
		if (!this.schema[key].array) throw guild.language.get('SETTING_GATEWAY_KEY_NOT_ARRAY', key);
		if (data === undefined) throw guild.language.get('SETTING_GATEWAY_SPECIFY_VALUE');
		const target = await this.validateGuild(guild);
		let result = await this.resolver[this.schema[key].type.toLowerCase()](data, target, key, this.schema[key]);
		if (result.id) result = result.id;
		const cache = this.get(target.id);
		if (type === 'add') {
			if (cache[key].includes(result)) throw guild.language.get('SETTING_GATEWAY_VALUE_FOR_KEY_ALREXT', data, key);
			cache[key].push(result);
			await this.provider.update('guilds', target.id, { [key]: cache[key] });
			await this.sync(target.id);
			return result;
		}
		if (!cache[key].includes(result)) throw guild.language.get('SETTING_GATEWAY_VALUE_FOR_KEY_NOEXT', data, key);
		cache[key] = cache[key].filter(value => value !== result);
		await this.provider.update('guilds', target.id, { [key]: cache[key] });
		await this.sync(target.id);
		return true;
	}

	/**
	 * Checks if a Guild is valid.
	 * @param {(Guild|Snowflake)} guild The Guild object or snowflake.
	 * @returns {Guild}
	 */
	async validateGuild(guild) {
		if (guild instanceof Guild) return guild;
		if (typeof guild === 'string' && /^(\d{17,19})$/.test(guild)) guild = this.client.guilds.get(guild);
		if (!guild) throw guild.language.get('SETTING_GATEWAY_EXPECTS_GUILD');
		return guild;
	}

}

module.exports = SettingGateway;
