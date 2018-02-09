const SchemaPiece = require('./SchemaPiece');
const Schema = require('./Schema');
const { toTitleCase, deepClone } = require('../util/util');
const fs = require('fs-nextra');

/**
 * <warning>You should never create an instance of this class. Use {@link SchemaFolder#addFolder} instead.</warning>
 * The schema class that stores (nested) folders and keys for SettingGateway usage. This class also implements multiple helpers.
 */
class SchemaFolder extends Schema {

	/**
	 * @typedef {Object} SchemaFolderAddOptions
	 * @property {string} type The type for the key
	 * @property {*} [default] The default value for the key
	 * @property {number} [min] The min value for the key (String.length for String, value for number)
	 * @property {number} [max] The max value for the key (String.length for String, value for number)
	 * @property {boolean} [array] Whether the key should be stored as Array or not
	 * @property {string} [sql] The datatype of the key
	 * @property {boolean} [configurable] Whether the key should be configurable by the config command or not
	 * @memberof SchemaFolder
	 */

	/**
	 * @since 0.5.0
	 * @param {KlasaClient} client The client which initialized this instance
	 * @param {Gateway} gateway The Gateway that manages this schema instance
	 * @param {Object} options The object containing the properties for this schema instance
	 * @param {?SchemaFolder} parent The parent which holds this instance
	 * @param {string} key The name of this key
	 */
	constructor(client, gateway, options, parent, key) {
		super(client, gateway, options, parent, key);

		/**
		 * The type of this schema instance.
		 * @since 0.5.0
		 * @type {'Folder'}
		 * @name SchemaFolder#type
		 * @readonly
		 */
		Object.defineProperty(this, 'type', { value: 'Folder' });

		/**
		 * The default values for this schema instance and children.
		 * @since 0.5.0
		 * @type {Object}
		 * @name SchemaFolder#defaults
		 */
		Object.defineProperty(this, 'defaults', { value: {}, writable: true });

		/**
		 * A pre-processed array with all keys' names.
		 * @since 0.5.0
		 * @type {string[]}
		 * @name SchemaFolder#keyArray
		 */
		Object.defineProperty(this, 'keyArray', { value: [], writable: true });

		this._init(options);
	}

	/**
	 * Get all configurable keys from this schema.
	 * @since 0.5.0
	 * @type {string[]}
	 * @readonly
	 */
	get configurableKeys() {
		if (this.keyArray.length === 0) return [];
		return this.keyArray.filter(key => this[key].type === 'Folder' || this[key].configurable);
	}

	/**
	 * Create a new nested folder.
	 * @since 0.5.0
	 * @param {string} key The name's key for the folder
	 * @param {Object} [object={}] An object containing all the SchemaFolders/SchemaPieces literals for this folder
	 * @param {boolean} [force=true] Whether this function call should modify all entries from the database
	 * @returns {Promise<SchemaFolder>}
	 */
	async addFolder(key, object = {}, force = true) {
		if (this.hasKey(key)) throw `The key ${key} already exists in the current schema.`;
		if (typeof this[key] !== 'undefined') throw `The key ${key} conflicts with a property of Schema.`;

		const folder = this._addKey(key, object, SchemaFolder);
		await fs.outputJSONAtomic(this.gateway.filePath, this.gateway.schema.toJSON());

		if (this.gateway.sql) {
			if (folder.keyArray.length > 0) {
				if (typeof this.gateway.provider.addColumn === 'function') await this.gateway.provider.addColumn(this.gateway.type, folder.getSQL());
				else throw new Error('The method \'addColumn\' in your provider is required in order to add new columns.');
			}
		} else if (force || this.gateway.type === 'clientStorage') {
			await this.force('add', key, folder);
		}

		await this._shardSyncSchema(folder, 'add', force);
		if (this.client.listenerCount('schemaKeyAdd')) this.client.emit('schemaKeyAdd', folder);
		return this.gateway.schema;
	}

	/**
	 * Remove a nested folder.
	 * @since 0.5.0
	 * @param {string} key The folder's name to remove
	 * @param {boolean} [force=true] Whether this function call should modify all entries from the database
	 * @returns {Promise<SchemaFolder>}
	 */
	async removeFolder(key, force = true) {
		if (this.hasKey(key) === false) throw new Error(`The key ${key} does not exist in the current schema.`);
		if (this[key].type !== 'Folder') throw new Error(`The key ${key} is not Folder type.`);

		const folder = this[key];
		this._removeKey(key);
		await fs.outputJSONAtomic(this.gateway.filePath, this.gateway.schema.toJSON());

		if (this.gateway.sql) {
			if (folder.keyArray.length > 0) {
				if (typeof this.gateway.provider.removeColumn === 'function') await this.gateway.provider.removeColumn(this.gateway.type, folder.getKeys());
				else throw new Error('The method \'removeColumn\' in your provider is required in order to remove columns.');
			}
		} else if (force || this.gateway.type === 'clientStorage') {
			await this.force('delete', key, folder);
		}

		await this._shardSyncSchema(folder, 'delete', force);
		if (this.client.listenerCount('schemaKeyRemove')) this.client.emit('schemaKeyRemove', folder);
		return this.gateway.schema;
	}

	/**
	 * Check if the key exists in this folder.
	 * @since 0.5.0
	 * @param {string} key The key to check
	 * @returns {boolean}
	 */
	hasKey(key) {
		return this.keyArray.includes(key);
	}

	/**
	 * Add a new key to this folder.
	 * @since 0.5.0
	 * @param {string} key The name for the key
	 * @param {SchemaFolderAddOptions} options The key's options to apply
	 * @param {boolean} [force=true] Whether this function call should modify all entries from the database
	 * @returns {Promise<SchemaFolder>}
	 */
	async addKey(key, options, force = true) {
		this._addKey(key, this._verifyKeyOptions(key, options), SchemaPiece);
		await fs.outputJSONAtomic(this.gateway.filePath, this.gateway.schema.toJSON());

		if (this.gateway.sql) {
			if (typeof this.gateway.provider.addColumn === 'function') await this.gateway.provider.addColumn(this.gateway.type, key, this[key].sql[1]);
			else throw new Error('The method \'addColumn\' in your provider is required in order to add new columns.');
		} else if (force || this.gateway.type === 'clientStorage') {
			await this.force('add', key, this[key]);
		}

		await this._shardSyncSchema(this[key], 'add', force);
		if (this.client.listenerCount('schemaKeyAdd')) this.client.emit('schemaKeyAdd', this[key]);
		return this.gateway.schema;
	}

	/**
	 * Remove a key from this folder.
	 * @since 0.5.0
	 * @param {string} key The key's name to remove
	 * @param {boolean} [force=true] Whether this function call should modify all entries from the database
	 * @returns {Promise<SchemaFolder>}
	 */
	async removeKey(key, force = true) {
		if (this.hasKey(key) === false) throw `The key ${key} does not exist in the current schema.`;
		const schemaPiece = this[key];
		this._removeKey(key);
		await fs.outputJSONAtomic(this.gateway.filePath, this.gateway.schema.toJSON());

		if (this.gateway.sql) {
			if (typeof this.gateway.provider.removeColumn === 'function') await this.gateway.provider.removeColumn(this.gateway.type, key);
			else throw new Error('The method \'removeColumn\' in your provider is required in order to remove columns.');
		} else if (force) {
			await this.force('delete', key, schemaPiece);
		}

		await this._shardSyncSchema(schemaPiece, 'delete', force);
		if (this.client.listenerCount('schemaKeyRemove')) this.client.emit('schemaKeyRemove', schemaPiece);
		return this.gateway.schema;
	}

	/**
	 * Modifies all entries from the database.
	 * @since 0.5.0
	 * @param {('add'|'edit'|'delete')} action The action to perform
	 * @param {string} key The key
	 * @param {(SchemaPiece|SchemaFolder)} piece The SchemaPiece instance to handle
	 * @returns {Promise<*>}
	 * @private
	 */
	force(action, key, piece) {
		if (!(piece instanceof SchemaPiece) && !(piece instanceof SchemaFolder)) throw new TypeError(`'schemaPiece' must be an instance of 'SchemaPiece' or an instance of 'SchemaFolder'.`);

		const values = this.gateway.cache.getValues(this.gateway.type);
		const path = piece.path.split('.');

		if (action === 'add' || action === 'edit') {
			const defValue = this.defaults[key];
			for (let i = 0; i < values.length; i++) {
				let value = values[i];
				for (let j = 0; j < path.length - 1; j++) value = value[path[j]];
				value[path[path.length - 1]] = deepClone(defValue);
			}
			return this.gateway.provider.updateValue(this.gateway.type, piece.path, defValue, this.gateway.options.nice);
		}

		if (action === 'delete') {
			for (let i = 0; i < values.length; i++) {
				let value = values[i];
				for (let j = 0; j < path.length - 1; j++) value = value[path[j]];
				delete value[path[path.length - 1]];
			}
			return this.gateway.provider.removeValue(this.gateway.type, piece.path, this.gateway.options.nice);
		}

		throw new TypeError(`Action must be either 'add' or 'delete'. Got: ${action}`);
	}

	/**
	 * Get a list.
	 * @since 0.5.0
	 * @param {KlasaMessage} msg The Message instance
	 * @returns {string}
	 */
	getList(msg) {
		const array = [];
		const folders = [];
		const keys = {};
		let longest = 0;
		for (const key of this.keyArray) {
			if (this[key].type === 'Folder') {
				folders.push(`// ${key}`);
			} else if (this[key].configurable) {
				if (!(this[key].type in keys)) keys[this[key].type] = [];
				if (key.length > longest) longest = key.length;
				keys[this[key].type].push(key);
			}
		}
		const keysTypes = Object.keys(keys);
		if (folders.length === 0 && keysTypes.length === 0) return '';
		if (folders.length) array.push('= Folders =', ...folders.sort(), '');
		if (keysTypes.length) {
			for (const keyType of keysTypes.sort()) {
				keys[keyType].sort();
				array.push(`= ${toTitleCase(keyType)}s =`);
				for (let i = 0; i < keys[keyType].length; i++) array.push(`${keys[keyType][i].padEnd(longest)} :: ${this[keys[keyType][i]].resolveString(msg)}`);
				array.push('');
			}
		}
		return array.join('\n');
	}

	/**
	 * Get a JSON object with all the default values.
	 * @since 0.5.0
	 * @param {Object} [data={}] The object to update
	 * @returns {Object}
	 */
	getDefaults(data = {}) {
		for (let i = 0; i < this.keyArray.length; i++) {
			const key = this.keyArray[i];
			if (key.type === 'Folder') data[key] = key.getDefaults(data[key]);
			else data[key] = deepClone(this[key].default);
		}
		return data;
	}

	/**
	 * Get all the SQL schemas from this schema's children.
	 * @since 0.5.0
	 * @param {string[]} [array=[]] The array to push.
	 * @returns {string[]}
	 */
	getSQL(array = []) {
		for (const key of this.keyArray) {
			if (this[key].type === 'Folder') this[key].getSQL(array);
			else array.push(this[key].sql);
		}
		return array;
	}

	/**
	 * Get all the pathes from this schema's children.
	 * @since 0.5.0
	 * @returns {string[]}
	 */
	getAllKeys() {
		const array = [];
		for (const value of this.values()) {
			if (value.type === 'Folder') array.push(...value.keyArray());
			else array.push(value.path);
		}
		return array;
	}

	/**
	 * Get all the SchemaPieces instances from this schema's children. Used for SQL.
	 * @since 0.5.0
	 * @returns {SchemaPiece[]}
	 */
	getAllValues() {
		const array = [];
		for (const value of this.values()) {
			if (value.type === 'Folder') array.push(...value.getAllValues());
			else array.push(value);
		}
		return array;
	}

	/**
	 * @since 0.5.0
	 * @returns {string}
	 */
	resolveString() {
		return this.toString();
	}

	/**
	 * Add a key to the instance.
	 * @since 0.5.0
	 * @param {string} key The name of the key
	 * @param {SchemaFolderAddOptions} options The options of the key
	 * @param {(SchemaFolder|SchemaPiece)} Piece The class to create
	 * @returns {(SchemaFolder|SchemaPiece)}
	 * @private
	 */
	_addKey(key, options, Piece) {
		if (this.hasKey(key)) throw new Error(`The key '${key}' already exists.`);
		const piece = new Piece(this.client, this.gateway, options, this, key);
		this[key] = piece;
		this.defaults[key] = piece.type === 'Folder' ? piece.defaults : options.default;

		this.keyArray.push(key);
		this.keyArray.sort((a, b) => a.localeCompare(b));

		return piece;
	}

	/**
	 * Remove a key from the instance.
	 * @since 0.5.0
	 * @param {string} key The name of the key
	 * @private
	 */
	_removeKey(key) {
		const index = this.keyArray.indexOf(key);
		if (index === -1) throw new Error(`The key '${key}' does not exist.`);

		this.keyArray.splice(index, 1);
		delete this[key];
		delete this.defaults[key];
	}

	/**
	 * Sync all shards' schemas.
	 * @since 0.5.0
	 * @param {(SchemaFolder|SchemaPiece)} piece The piece to send
	 * @param {('add'|'delete'|'update')} action Whether the piece got added or removed
	 * @param {boolean} force Whether the piece got modified with force or not
	 * @private
	 */
	async _shardSyncSchema(piece, action, force) {
		if (!this.client.shard) return;
		await this.client.shard.broadcastEval(`
			if (this.shard.id !== ${this.client.shard.id}) {
				this.gateways.${this.gateway.type}._shardSync(
					${JSON.stringify(piece.path.split('.'))}, ${JSON.stringify(piece)}, ${action}, ${force});
			}
		`);
	}

	/**
	 * Verifies the key add options.
	 * @since 0.5.0
	 * @param {string} key The name for the key
	 * @param {SchemaFolderAddOptions} options The key's options to apply
	 * @returns {addOptions}
	 * @private
	 */
	_verifyKeyOptions(key, options) {
		if (this.hasKey(key)) throw `The key ${key} already exists in the current schema.`;
		if (typeof this[key] !== 'undefined') throw `The key ${key} conflicts with a property of Schema.`;
		if (!options) throw 'You must pass an options argument to this method.';
		if (typeof options.type !== 'string') throw 'The option type is required and must be a string.';
		options.type = options.type.toLowerCase();
		if (!this.client.gateways.types.includes(options.type)) throw `The type ${options.type} is not supported.`;
		if (typeof options.min !== 'undefined' && isNaN(options.min)) throw 'The option min must be a number.';
		if (typeof options.max !== 'undefined' && isNaN(options.max)) throw 'The option max must be a number.';
		if (typeof options.array !== 'undefined' && typeof options.array !== 'boolean') throw 'The option array must be a boolean.';
		if (typeof options.configurable !== 'undefined' && typeof options.configurable !== 'boolean') throw 'The option configurable must be a boolean.';
		if (options.array) {
			if (typeof options.default === 'undefined') options.default = [];
			else if (!Array.isArray(options.default)) throw 'The option default must be an array if the array option is set to true.';
		} else {
			if (typeof options.default === 'undefined') options.default = options.type === 'boolean' ? false : null;
			options.array = false;
		}
		return options;
	}

	/**
	 * Method called in initialization to populate the instance with the keys from the schema.
	 * @since 0.5.0
	 * @param {Object} object The object to parse. Only called once per initialization
	 * @returns {true}
	 * @private
	 */
	_init(object) {
		if (this._inited) throw new Error(`[INIT] ${this} has already initialized.`);

		for (const key of Object.keys(object)) {
			if (typeof object[key] !== 'object') continue;
			// Force retro compatibility with SGv1's schema
			if (typeof object[key].type === 'undefined') object[key].type = 'Folder';
			if (object[key].type === 'Folder') {
				const folder = new SchemaFolder(this.client, this.gateway, object[key], this, key);
				this[key] = folder;
				this.defaults[key] = folder.defaults;
			} else {
				const piece = new SchemaPiece(this.client, this.gateway, object[key], this, key);
				this[key] = piece;
				this.defaults[key] = piece.default;
			}
			this.keyArray.push(key);
		}
		this.keyArray.sort((a, b) => a.localeCompare(b));
		this._inited = true;

		return true;
	}

	/**
	 * Returns a new Iterator object that contains the `[key, value]` pairs for each element contained in this folder.
	 * Identical to [Map.entries()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/entries)
	 * @since 0.5.0
	 * @generator
	 * @yields {[string, (SchemaFolder|SchemaPiece)]}
	 */
	*entries() {
		for (const key of this.keyArray) yield [key, this[key]];
	}

	/**
	 * Returns a new Iterator object that contains the values for each element contained in this folder.
	 * Identical to [Map.values()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/values)
	 * @since 0.5.0
	 * @generator
	 * @yields {(SchemaFolder|SchemaPiece)}
	 */
	*values() {
		for (const key of this.keyArray) yield this[key];
	}

	/**
	 * Returns a new Iterator object that contains the keys for each element contained in this folder.
	 * Identical to [Map.keys()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/keys)
	 * @since 0.5.0
	 * @generator
	 * @yields {string}
	 */
	*keys() {
		for (const key of this.keyArray) yield key;
	}

	/**
	 * Returns a new Iterator object that contains the `[key, value]` pairs for each element contained in this folder.
	 * Identical to [Map.entries()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/entries)
	 * @since 0.5.0
	 * @generator
	 * @returns {IterableIterator<[string, (SchemaFolder|SchemaPiece)]>}
	 */
	[Symbol.iterator]() {
		return this.entries();
	}

	/**
	 * Get a JSON object containing all the objects from this schema's children.
	 * @since 0.5.0
	 * @returns {any}
	 */
	toJSON() {
		return Object.assign({ type: 'Folder' }, ...this.keyArray.map(key => ({ [key]: this[key].toJSON() })));
	}

	/**
	 * @since 0.5.0
	 * @returns {string}
	 */
	toString() {
		return this.configurableKeys.length !== 0 ? '{ Folder }' : '{ Empty Folder }';
	}

}

module.exports = SchemaFolder;
