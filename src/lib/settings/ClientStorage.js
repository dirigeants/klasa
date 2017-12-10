const GatewayStorage = require('./GatewayStorage');
const SchemaPiece = require('./SchemaPiece');
const Schema = require('./Schema');

/**
 * The ClientStorage class that manages client-wide configurations.
 * @extends GatewayStorage
 */
class ClientStorage extends GatewayStorage {

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
	 * (async () => {
	 *     await this.client.configs.updateOne('userBlacklist', ['272689325521502208']);
	 *     console.log(this.client.configs.get('userBlacklist')); // ['272689325521502208']
	 * })();
	 *
	 * // Updating a nested key, for example, the property 'users' of folder 'blacklist'
	 * (async () => {
	 *     await this.client.configs.updateOne('blacklist.users', ['272689325521502208']);
	 *     console.log(this.client.configs.get('blacklist.users')); // ['272689325521502208']
	 * })();
	 */
	async updateOne(path, value) {
		const route = typeof path === 'string' ? path.split('.') : path;
		if (value && value.id) value = value.id;
		const lastKey = route.pop();
		let { data } = this;
		for (const key of route) data = data[key];
		data[lastKey] = value;
		if (this.sql) await this.provider.update(this.type, 'klasa', [route.join('.')], [value]);
		else await this.provider.update(this.type, 'klasa', this.data);
		await this._shardSyncEmit(path.split('.'), value, 'update');

		return this;
	}

	/**
	 * Set a new key or object into the schema.
	 * @since 0.5.0
	 * @param {(string|string[])} path The path to set the data to.
	 * @param {AddOptions} value The value for the new key.
	 * @returns {Promise<ClientStorage>}
	 */
	async addKey(path, value) {
		const route = typeof path === 'string' ? path.split('.') : path;
		const lastKey = route.pop();
		let { schema, data } = this;
		for (const key of route) {
			schema = schema[key];
			data = schema[key];
		}
		if (!value.type || value.type === 'Folder') schema[lastKey] = new Schema(this.client, this, value, schema, lastKey);
		else schema[lastKey] = new SchemaPiece(this.client, this, value, schema, lastKey);
		data[lastKey] = schema[lastKey].type === 'Folder' ? schema[lastKey].defaults : schema[lastKey].default;

		if (this.sql) {
			if (typeof this.provider.addColumn === 'function') await this.provider.addColumn(this.type, lastKey, schema[lastKey].sql[1]);
			else throw new Error('The method \'addColumn\' in your provider is required in order to add new columns.');
		} else {
			await this.provider.update(this.type, 'klasa', this.data);
		}
		await this._shardSyncEmit(path.split('.'), schema[lastKey], 'add');

		return this;
	}

	/**
	 * Delete a key or object from the schema.
	 * @since 0.5.0
	 * @param {(string|string[])} path The path to delete the data from.
	 * @returns {Promise<ClientStorage>}
	 */
	async removeKey(path) {
		const route = typeof path === 'string' ? path.split('.') : path;
		const lastKey = route.pop();
		let { schema, data } = this;
		for (const key of route) {
			schema = schema[key];
			data = schema[key];
		}
		if (typeof schema[lastKey] !== 'undefined') {
			const piece = schema[lastKey];
			delete schema[lastKey];
			delete data[lastKey];

			if (this.sql) {
				if (typeof this.provider.removeColumn === 'function') await this.provider.removeColumn(this.type, lastKey);
				else throw new Error('The method \'removeColumn\' in your provider is required in order to remove columns.');
			} else {
				await this.provider.replace(this.type, 'klasa', this.data);
			}
			await this._shardSyncEmit(path.split('.'), piece, 'delete');
		}

		return this;
	}

	/**
	 * Inits the table and the schema for its use in this gateway.
	 * @since 0.5.0
	 * @private
	 */
	async init() {
		await this.initSchema();
		await this.initTable();
		const data = await this.provider.get(this.type, 'klasa');
		if (!data) {
			await this.provider.create(this.type, 'klasa');
			this.data = this.schema.getDefaults();
		} else {
			this.data = this.sql ? this.parseEntry(data) : data;
		}
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

}

module.exports = ClientStorage;
