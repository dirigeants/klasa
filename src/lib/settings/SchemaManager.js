const { resolve } = require('path');
const fs = require('fs-nextra');

const validTypes = ['User', 'Channel', 'Guild', 'Role', 'Boolean', 'String', 'Integer', 'Float', 'url', 'Command'];

class SchemaManager {

	constructor(client) {
		this.client = client;
		this.schema = {};
		this.defaults = {};
	}

	/**
   * Initialize the SchemaManager.
   * @returns {void}
   */
	async init() {
		const baseDir = resolve(this.client.clientBaseDir, 'bwd');
		await fs.ensureDir(baseDir);
		this.filePath = resolve(baseDir, 'schema.json');
		const schema = await fs.readJSON(this.filePath)
			.catch(() => fs.outputJSONAtomic(this.filePath, this.defaultDataSchema).then(() => this.defaultDataSchema));
		return this.validate(schema);
	}

	/**
   * Validate the Schema manager.
   * @param {Object} schema The Schema object that will be used for the configuration system.
   * @returns {void}
   */
	validate(schema) {
		if (!('prefix' in schema)) {
			this.client.emit('log', "The key 'prefix' is obligatory", 'error');
			schema.prefix = {
				type: 'String',
				default: this.client.config.prefix
			};
		}
		for (const [key, value] of Object.entries(schema)) { // eslint-disable-line no-restricted-syntax
			if (value instanceof Object && 'type' in value && 'default' in value) {
				if (value.array && !(value.default instanceof Array)) {
					this.client.emit('log', `The default value for ${key} must be an array.`, 'error');
					continue;
				}
				this.schema[key] = value;
				this.defaults[key] = value.default;
			} else {
				this.client.emit('log', `The type value for ${key} is not supported. It must be an object with type and default properties.`, 'error');
			}
		}
	}

	/**
   * Add a new key to the schema.
   * @param {string} key The key to add.
   * @param {Object} options Options for the key.
   * @param {string} options.type The type for the key.
   * @param {string} options.default The default value for the key.
   * @param {boolean} options.array Whether the key should be stored as Array or not.
   * @param {number} options.min The min value for the key (String.length for String, value for number).
   * @param {number} options.max The max value for the key (String.length for String, value for number).
   * @param {boolean} [force=false] Whether this change should modify all configurations or not.
   * @returns {Promise<void>}
   */
	async add(key, options, force = false) {
		if (key in this.schema) throw `The key ${key} already exists in the current schema.`;
		if (!options.type) throw 'The option type is required.';
		if (!validTypes.includes(options.type)) throw `The type ${options.type} is not supported.`;
		if ('min' in options && isNaN(options.min)) throw 'The option min must be a number.';
		if ('max' in options && isNaN(options.max)) throw 'The option max must be a number.';
		if (options.array) {
			if (options.array.constructor.name !== 'Boolean') throw 'The option array must be a boolean.';
			if (!options.default) options.default = [];
			else if (!(options.default instanceof Array)) throw 'The option default must be an array if the array option is set to true.';
		} else {
			if (!options.default) options.default = null;
			options.array = false;
		}
		if (this.settingGateway.sql) options.sql = this.settingGateway.sql.buildSingleSQLSchema(options);
		this.schema[key] = options;
		this.defaults[key] = options.default;
		if (force) await this.force('add', key);
		return fs.outputJSONAtomic(this.filePath, this.schema);
	}

	/**
   * Remove a key from the schema.
   * @param {string} key The key to remove.
   * @param {boolean} [force=false] Whether this change should modify all configurations or not.
   * @returns {Promise<void>}
   */
	async remove(key, force = false) {
		if (key === 'prefix') throw "You can't remove the prefix key.";
		delete this.schema[key];
		if (force) await this.force('delete', key);
		return fs.outputJSONAtomic(this.filePath, this.schema);
	}

	/**
   * Modify all configurations.
   * @param {string} action Whether reset, add, or delete.
   * @param {string} key The key to update.
   * @returns {void}
   */
	async force(action, key) {
		if (this.settingGateway.sql) {
			await this.settingGateway.sql.updateColumns(this.schema, this.defaults, key);
		}
		const data = this.settingGateway.getAll('guilds');
		let value;
		if (action === 'add') value = this.defaults[key];
		await Promise.all(data.map(async (obj) => {
			const object = obj;
			if (action === 'delete') delete object[key];
			else object[key] = value;
			if (obj.id) await this.client.settingGateway.provider.replace('guilds', obj.id, object);
			return true;
		}));
		return this.settingGateway.sync();
	}

	/**
   * Shortcut for settingGateway
   * @readonly
   * @memberof SchemaManager
   */
	get settingGateway() {
		return this.client.settingGateway;
	}

	/**
   * Get the default DataSchema from Klasa.
   * @readonly
   * @returns {Object}
   */
	get defaultDataSchema() {
		return {
			prefix: {
				type: 'String',
				default: this.client.config.prefix,
				array: false,
				sql: `TEXT NOT NULL DEFAULT '${this.client.config.prefix}'`
			},
			modRole: {
				type: 'Role',
				default: null,
				array: false,
				sql: 'TEXT'
			},
			adminRole: {
				type: 'Role',
				default: null,
				array: false,
				sql: 'TEXT'
			},
			disabledCommands: {
				type: 'Command',
				default: [],
				array: true,
				sql: "TEXT DEFAULT '[]'"
			}
		};
	}

}

module.exports = SchemaManager;
