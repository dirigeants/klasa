const GatewayStorage = require('./GatewayStorage');
const SchemaPiece = require('./SchemaPiece');
const Schema = require('./Schema');

class ClientStorage extends GatewayStorage {

	constructor(client) {
		super(client, 'clientStorage');

		/**
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
	 * Get a value from the global configuration.
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
	 * @param {(string|string[])} path The path to set the data to.
	 * @param {*} value The new value for the key.
	 * @returns {Promise<ClientStorage>}
	 */
	async update(path, value) {
		const route = typeof path === 'string' ? path.split('.') : path;
		if (value && value.id) value = value.id;
		const lastKey = route.pop();
		let { data } = this;
		for (const key of route) data = data[key];
		data[lastKey] = value;
		if (this.sql) await this.provider.update(this.type, 'klasa', [route.join('.')], [value]);
		else await this.provider.update(this.type, 'klasa', this.data);

		return this;
	}

	/**
	 * Set a new key or object into the schema.
	 * @param {(string|string[])} path The path to set the data to.
	 * @param {AddOptions} value The value for the new key.
	 * @returns {Promise<ClientStorage>}
	 */
	async set(path, value) {
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

		return this;
	}

	/**
	 * Delete a key or object from the schema.
	 * @param {(string|string[])} path The path to delete the data from.
	 * @returns {Promise<ClientStorage>}
	 */
	async delete(path) {
		const route = typeof path === 'string' ? path.split('.') : path;
		const lastKey = route.pop();
		let { schema, data } = this;
		for (const key of route) {
			schema = schema[key];
			data = schema[key];
		}
		if (typeof schema[lastKey] !== 'undefined') {
			delete schema[lastKey];
			delete data[lastKey];

			if (this.sql) {
				if (typeof this.provider.removeColumn === 'function') await this.provider.removeColumn(this.type, lastKey);
				else throw new Error('The method \'removeColumn\' in your provider is required in order to remove columns.');
			} else {
				await this.provider.replace(this.type, 'klasa', this.data);
			}
		}

		return this;
	}

}

module.exports = ClientStorage;
