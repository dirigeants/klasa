const { resolve } = require('path');
const fs = require('fs-nextra');
const CacheManager = require('./CacheManager');

const validTypes = ['User', 'Channel', 'TextChannel', 'VoiceChannel', 'Guild', 'Role', 'Boolean', 'String', 'Integer', 'Float', 'url', 'Command'];

/**
 * The Schema driver for SettingGateway
 * @extends {CacheManager}
 */
class SchemaManager extends CacheManager {

	/**
	 * @param {KlasaClient} client The Klasa client
	 */
	constructor(client) {
		super(client);

		/**
		 * The schema created for this SchemaManager instance.
		 */
		this.schema = {};

		/**
		 * The default values for this SchemaManager instance.
		 */
		this.defaults = {};
	}

	/**
	 * Initialize the SchemaManager.
	 * @returns {void}
	 */
	async initSchema() {
		const baseDir = resolve(this.client.clientBaseDir, 'bwd');
		await fs.ensureDir(baseDir);
		this.filePath = resolve(baseDir, `${this.type}_Schema.json`);
		const schema = await fs.readJSON(this.filePath)
			.catch(() => fs.outputJSONAtomic(this.filePath, this.defaultDataSchema).then(() => this.defaultDataSchema));
		return this.validateSchema(schema);
	}

	/**
	 * Validate the Schema manager.
	 * @param {Object} schema The Schema object that will be used for the configuration system.
	 * @returns {void}
	 */
	validateSchema(schema) {
		for (const [key, value] of Object.entries(schema)) { // eslint-disable-line no-restricted-syntax
			if (value instanceof Object && 'type' in value && 'default' in value) {
				if (value.array && !(value.default instanceof Array)) {
					this.client.emit('error', `The default value for ${key} must be an array.`);
					continue;
				}
				this.schema[key] = value;
				this.defaults[key] = value.default;
			} else {
				this.client.emit('error', `The type value for ${key} is not supported. It must be an object with type and default properties.`);
			}
		}
	}

	/**
	 * @typedef {Object} AddOptions
	 * @property {string} type The type for the key.
	 * @property {any} default The default value for the key.
	 * @property {number} min The min value for the key (String.length for String, value for number).
	 * @property {number} max The max value for the key (String.length for String, value for number).
	 * @property {boolean} array Whether the key should be stored as Array or not.
	 * @memberof SchemaManager
	 */

	/**
	 * Add a new key to the schema.
	 * @param {string} key The key to add.
	 * @param {AddOptions} options Options for the key.
	 * @param {boolean} [force=true] Whether this change should modify all configurations or not.
	 * @returns {void}
	 * @example
	 * // Add a key called 'modlog', being a TextChannel.
	 * SchemaManager.add('modlog', { type: 'TextChannel' });
	 *
	 * // Add a key called 'playlist-length', being an Integer with minimum value of 5 and max 20, being 15 by default.
	 * SchemaManager.add('playlist-length', { type: 'Integer', default: 15, min: 5, max: 20 });
	 */
	async add(key, options, force = true) {
		if (key in this.schema) throw `The key ${key} already exists in the current schema.`;
		if (!options.type) throw 'The option type is required.';
		if (!validTypes.includes(options.type)) throw `The type ${options.type} is not supported.`;
		if ('min' in options && isNaN(options.min)) throw 'The option min must be a number.';
		if ('max' in options && isNaN(options.max)) throw 'The option max must be a number.';
		if ('array' in options && options.array.constructor.name !== 'Boolean') throw 'The option array must be a boolean.';
		if (options.array === true) {
			options.default = 'default' in options ? options.default : [];
			if (!Array.isArray(options.default)) throw 'The option default must be an array if the array option is set to true.';
		} else {
			options.default = 'default' in options ? options.default : null;
			options.array = false;
		}
		if (this.sql) options.sql = this.sql.buildSingleSQLSchema(options);
		this.schema[key] = options;
		this.defaults[key] = options.default;
		if (force) await this.force('add', key);
		return fs.outputJSONAtomic(this.filePath, this.schema);
	}

	/**
	 * Remove a key from the schema.
	 * @param {string} key The key to remove.
	 * @param {boolean} [force=false] Whether this change should modify all configurations or not.
	 * @returns {void}
	 * @example
	 * // Remove a key called 'modlog'.
	 * SchemaManager.remove('modlog');
	 */
	async remove(key, force = true) {
		delete this.schema[key];
		if (force) await this.force('delete', key);
		return fs.outputJSONAtomic(this.filePath, this.schema);
	}

	/**
	 * Modify all configurations. Do NOT use this directly.
	 * @param {string} action Whether reset, add, or delete.
	 * @param {string} key The key to update.
	 * @private
	 * @returns {void}
	 */
	async force(action, key) {
		if (this.sql) {
			await this.sql.updateColumns(this.schema, this.defaults, key);
		}
		const data = this.getAll(this.type);
		let value;
		if (action === 'add') value = this.defaults[key];
		await Promise.all(data.map(async (obj) => {
			const object = obj;
			if (action === 'delete') delete object[key];
			else object[key] = value;
			if (obj.id) await this.provider.replace(this.type, obj.id, object);
			return true;
		}));
		return this.sync();
	}

}

module.exports = SchemaManager;
