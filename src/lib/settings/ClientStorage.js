const GatewayStorage = require('./GatewayStorage');
const SchemaPiece = require('./SchemaPiece');
const Schema = require('./Schema');

/**
 * The ClientStorage class that manages client-wide configurations.
 * @extends GatewayStorage
 */
class ClientStorage extends GatewayStorage {

	/**
	 * @typedef  {Object} ClientStoragePathResult
	 * @property {Schema} schema
	 * @property {*} data
	 * @property {string} lastKey
	 * @memberof ClientStorage
	 */

	/**
	 * @since 0.5.0
	 * @param {KlasaClient} client The client which initialized this instance.
	 */
	constructor(client) {
		super(client, 'clientStorage');

		/**
		 * @since 0.5.0
		 * @type {Object}
		 */
		this.data = null;
	}

	/**
	 * The data schema Klasa uses for client configs.
	 * @since 0.5.0
	 * @readonly
	 */
	get defaultSchema() {
		return {
			userBlacklist: {
				type: 'user',
				default: [],
				min: null,
				max: null,
				array: true,
				configurable: true,
				sql: 'TEXT'
			},
			guildBlacklist: {
				type: 'guild',
				default: [],
				min: null,
				max: null,
				array: true,
				configurable: true,
				sql: 'TEXT'
			}
		};
	}

	/**
	 * Get a value from the global configuration.
	 * @since 0.5.0
	 * @param {(string|string[])} path The path to get the data from.
	 * @returns {any}
	 */
	get(path) {
		const route = typeof path === 'string' ? path.split('.') : path;
		let routed = this.data;
		for (const key of route) routed = routed[key];
		return routed;
	}

	/**
	 * Update a key from the global configuration.
	 * @since 0.5.0
	 * @param {(string|string[])} path The path to set the data to.
	 * @param {*} value The new value for the key.
	 * @returns {Promise<ClientStorage>}
	 * @example
	 * // Updating the key 'userBlacklist'
	 * await this.client.configs.updateOne('userBlacklist', ['272689325521502208']);
	 * console.log(this.client.configs.get('userBlacklist'));
	 * // ['272689325521502208']
	 *
	 * // Updating a nested key, for example, the property 'users' of folder 'blacklist'
	 * await this.client.configs.updateOne('blacklist.users', ['272689325521502208']);
	 * console.log(this.client.configs.get('blacklist.users'));
	 * // ['272689325521502208']
	 */
	async updateOne(path, value) {
		const { schema, data, lastKey } = this.getFolder(path);
		if (value && value.id) value = value.id;
		data[lastKey] = value;
		if (this.sql) await this.provider.update(this.type, 'klasa', [schema[lastKey].path], [value]);
		else await this.provider.update(this.type, 'klasa', this.data);
		await this._shardSyncEmit(path.split('.'), value, 'update');

		return this;
	}

	/**
	 * Gets a path.
	 * @since 0.5.0
	 * @param {(string|string[])} path The path to get.
	 * @returns {ClientStoragePathResult}
	 * @private
	 */
	getFolder(path) {
		const route = typeof path === 'string' ? path.split('.') : path;
		const lastKey = route.pop();
		let { data, schema } = this;
		for (const key of route) {
			if (!schema.hasKey(key)) throw new Error(`The key ${schema.path ? `${schema.path}.` : ''}${key} does not exist in the current schema.`);
			if (schema[key].type !== 'Folder') break;
			schema = schema[key];
			data = data[key];
		}

		return { schema, data, lastKey };
	}

	/**
	 * Inits the table and the schema for its use in this gateway.
	 * @since 0.5.0
	 * @private
	 */
	async init() {
		if (this.ready) throw new Error('KlasaGatewayStorage already inited.');
		await this.initSchema();
		await this.initTable();
		const data = await this.provider.get(this.type, 'klasa');
		if (!data) {
			await this.provider.create(this.type, 'klasa');
			this.data = this.schema.getDefaults();
		} else {
			this.data = ClientStorage._merge(this.sql ? this.parseEntry(data) : data, this.schema);
		}

		this.ready = true;
	}

	/**
	 * Sync this shard's ClientStorage.
	 * @since 0.5.0
	 * @param {string[]} path The key's path.
	 * @param {Object} data The data to insert.
	 * @param {('add'|'delete'|'update')} action Whether the piece got added or removed.
	 * @private
	 */
	_shardSync(path, data, action) {
		if (this.client.options.shardCount === 0) return;
		const parsed = typeof data === 'string' ? JSON.parse(data) : data;
		let { schema: route, data: cache } = this;
		const key = path.pop();
		for (const pt of path) {
			route = route[pt];
			cache = cache[pt];
		}
		if (action === 'add') {
			if (parsed.type === 'Folder') {
				route[key] = new Schema(this.client, this, parsed, route, key);
				cache[key] = route[key].defaults;
			} else {
				route[key] = new SchemaPiece(this.client, this, parsed, route, key);
				cache[key] = route[key].default;
			}
		} else if (action === 'delete') {
			delete route[key];
			delete cache[key];
		} else {
			cache[key] = data;
		}
	}

	/**
	 * Sync all shards' schemas.
	 * @since 0.5.0
	 * @param {string[]} path The path of the config key to patch.
	 * @param {(Schema|SchemaPiece|Object)} data The data to send.
	 * @param {('add'|'delete'|'update')} action Whether the piece got added or removed.
	 * @private
	 */
	async _shardSyncEmit(path, data, action) {
		if (this.client.options.shardCount === 0) return;
		await this.client.shard.broadcastEval(`this.configs._shardSync(${path}, ${JSON.stringify(data)}, ${action});`);
	}

	/**
	 * Get a JSON object containing the data this instance holds.
	 * @since 0.5.0
	 * @returns {Object}
	 */
	toJSON() {
		return this.data;
	}

	/**
	 * Assign data to the ClientStorage instance.
	 * @since 0.5.0
	 * @param {Object} data The data contained in the group.
	 * @param {(Schema|SchemaPiece)} schema A Schema or a SchemaPiece instance.
	 * @returns {Object}
	 * @private
	 * @static
	 */
	static _merge(data, schema) {
		if (schema.type === 'Folder') {
			if (typeof data === 'undefined') data = {};
			for (let i = 0; i < schema.keyArray.length; i++) {
				const key = schema.keyArray[i];
				data[key] = ClientStorage._merge(data[key], schema[key]);
			}
		} else if (typeof data === 'undefined') {
			// It's a SchemaPiece instance, so it has a property of 'key'.
			data = schema.array ? schema.default.slice(0) : schema.default;
		} else if (schema.array) {
			// Some SQL databases are unable to store Arrays...
			data = data === null ? schema.default.slice(0) : typeof data === 'string' ? JSON.stringify(data) : schema.default.slice(0);
		}

		return data;
	}

}

module.exports = ClientStorage;
