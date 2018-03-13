const SchemaPiece = require('./SchemaPiece');
const Schema = require('./Schema');
const { deepClone, isObject } = require('../util/util');
const fs = require('fs-nextra');

/**
 * <warning>You should never create an instance of this class. Use {@link SchemaFolder#add} instead.</warning>
 * The schema class that stores (nested) folders and keys for SettingGateway usage. This class also implements multiple helpers.
 * @extends Schema
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
		if (!this.keyArray.length) return [];
		return this.keyArray.filter(key => this[key].type === 'Folder' ? this[key].configurableKeys.length : this[key].configurable);
	}

	/**
	 * The default values for this schema instance and children.
	 * @since 0.5.0
	 * @type {Object}
	 * @readonly
	 */
	get defaults() {
		const defaults = {};
		for (const [key, value] of this) {
			defaults[key] = value.type === 'Folder' ? value.defaults : value.default;
		}
		return defaults;
	}

	/**
	 * Create a new nested folder.
	 * @since 0.5.0
	 * @param {string} key The name's key for the folder
	 * @param {Object} options An object containing the options for the new piece or folder. Check {@tutorial UnderstandingSchemaFolders}
	 * @param {boolean} [force=true] Whether this function call should modify all entries from the database
	 * @returns {SchemaFolder}
	 * @example
	 * // Add a new SchemaPiece
	 * SchemaFolder.add('modlog', {
	 *     type: 'TextChannel'
	 * });
	 *
	 * // Add an empty new SchemaFolder
	 * SchemaFolder.add('channels');
	 *
	 * // Optionally, you can set the type Folder,
	 * // if no type is set, 'Folder' will be implied.
	 * SchemaFolder.add('channels', {
	 *     type: 'Folder'
	 * });
	 *
	 * // Add a new SchemaFolder with a modlog key inside
	 * SchemaFolder.add('channels', {
	 *     modlog: {
	 *         type: 'TextChannel'
	 *     }
	 * });
	 */
	async add(key, options = {}, force = true) {
		if (this.has(key)) throw new Error(`The key ${key} already exists in the current schema.`);
		if (typeof this[key] !== 'undefined') throw new Error(`The key ${key} conflicts with a property of Schema.`);
		if (!options || !isObject(options)) throw new Error(`The options object is required.`);
		if (typeof options.type !== 'string' || options.type.toLowerCase() === 'folder') options.type = 'Folder';

		// Create the piece and save the current schema
		const piece = this._add(key, options, options.type === 'Folder' ? SchemaFolder : SchemaPiece);
		await fs.outputJSONAtomic(this.gateway.filePath, this.gateway.schema);

		if (this.gateway.sql) {
			if (piece.type !== 'Folder' || piece.keyArray.length) {
				await this.gateway.provider.addColumn(this.gateway.type, piece.type === 'Folder' ?
					piece.getSQL() : [piece.sql]);
			}
		} else if (force || (this.gateway.type === 'clientStorage' && this.client.shard)) {
			await this.force('add', key, piece);
		}

		await this._shardSyncSchema(piece, 'add', force);
		this.client.emit('schemaKeyAdd', piece);
		return this.gateway.schema;
	}

	/**
	 * Remove a key
	 * @since 0.5.0
	 * @param {string} key The key's name to remove
	 * @param {boolean} [force=true] Whether this function call should modify all entries from the database
	 * @returns {SchemaFolder}
	 */
	async remove(key, force = true) {
		if (!this.has(key)) throw new Error(`The key ${key} does not exist in the current schema.`);

		// Get the key, remove it from the configs and update the persistent schema
		const piece = this._remove(key);
		await fs.outputJSONAtomic(this.gateway.filePath, this.gateway.schema);

		// A SQL database has the advantage of being able to update all keys along the schema, so force is ignored
		if (this.gateway.sql) {
			if (piece.type !== 'Folder' || (piece.type === 'Folder' && piece.keyArray.length)) {
				await this.gateway.provider.removeColumn(this.gateway.type, piece.type === 'Folder' ?
					[...piece.keys(true)] : key);
			}
		} else if (force || (this.gateway.type === 'clientStorage' && this.client.shard)) {
			// If force, or if the gateway is clientStorage, it should update all entries
			await this.force('delete', key, piece);
		}

		await this._shardSyncSchema(piece, 'delete', force);
		this.client.emit('schemaKeyRemove', piece);
		return this.gateway.schema;
	}

	/**
	 * Check if the key exists in this folder.
	 * @since 0.5.0
	 * @param {string} key The key to check
	 * @returns {boolean}
	 */
	has(key) {
		return this.keyArray.includes(key);
	}

	/**
	 * Modifies all entries from the database.
	 * @since 0.5.0
	 * @param {('add'|'delete')} action The action to perform
	 * @param {string} key The key
	 * @param {(SchemaPiece|SchemaFolder)} piece The SchemaPiece instance to handle
	 * @returns {Promise<*>}
	 * @private
	 */
	force(action, key, piece) {
		if (!(piece instanceof SchemaPiece) && !(piece instanceof SchemaFolder)) {
			throw new TypeError(`'schemaPiece' must be an instance of 'SchemaPiece' or an instance of 'SchemaFolder'.`);
		}

		const path = piece.path.split('.');

		if (action === 'add') {
			const defValue = piece.type === 'Folder' ? piece.defaults : piece.default;
			for (let value of this.gateway.cache.values()) {
				for (let j = 0; j < path.length - 1; j++) value = value[path[j]];
				value[path[path.length - 1]] = deepClone(defValue);
			}
			return this.gateway.provider.updateValue(this.gateway.type, piece.path, defValue, this.gateway.options.nice);
		}

		if (action === 'delete') {
			for (let value of this.gateway.cache.values()) {
				for (let j = 0; j < path.length - 1; j++) value = value[path[j]];
				delete value[path[path.length - 1]];
			}
			return this.gateway.provider.removeValue(this.gateway.type, piece.path, this.gateway.options.nice);
		}

		throw new TypeError(`Action must be either 'add' or 'delete'. Got: ${action}`);
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
	 * Add a key to the instance.
	 * @since 0.5.0
	 * @param {string} key The name of the key
	 * @param {SchemaFolderAddOptions} options The options of the key
	 * @param {(SchemaFolder|SchemaPiece)} Piece The class to create
	 * @returns {(SchemaFolder|SchemaPiece)}
	 * @private
	 */
	_add(key, options, Piece) {
		if (this.has(key)) throw new Error(`The key '${key}' already exists.`);
		this[key] = new Piece(this.client, this.gateway, options, this, key);

		const index = this.keyArray.findIndex(entry => entry.localeCompare(key));
		if (index === -1) this.keyArray.push(key);
		else this.keyArray.splice(index, 0, key);

		return this[key];
	}

	/**
	 * Remove a key from the instance.
	 * @since 0.5.0
	 * @param {string} key The name of the key
	 * @returns {(SchemaFolder|SchemaPiece)}
	 * @private
	 */
	_remove(key) {
		const index = this.keyArray.indexOf(key);
		if (index === -1) throw new Error(`The key '${key}' does not exist.`);

		this.keyArray.splice(index, 1);
		const piece = this[key];
		delete this[key];

		return piece;
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
					${JSON.stringify(piece.path.split('.'))}, ${JSON.stringify(piece)}, '${action}', ${force});
			}
		`);
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
			} else {
				const piece = new SchemaPiece(this.client, this.gateway, object[key], this, key);
				this[key] = piece;
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
	 * @param {boolean} recursive Whether the iteration should be recursive
	 * @yields {Array<string|SchemaFolder|SchemaPiece>}
	 */
	*entries(recursive = false) {
		if (recursive) {
			for (const key of this.keyArray) {
				if (this[key].type === 'Folder') yield* this[key].entries(true);
				else yield [key, this[key]];
			}
		} else {
			for (const key of this.keyArray) yield [key, this[key]];
		}
	}

	/**
	 * Returns a new Iterator object that contains the values for each element contained in this folder.
	 * Identical to [Map.values()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/values)
	 * @since 0.5.0
	 * @param {boolean} recursive Whether the iteration should be recursive
	 * @yields {(SchemaFolder|SchemaPiece)}
	 */
	*values(recursive = false) {
		if (recursive) {
			for (const key of this.keyArray) {
				if (this[key].type === 'Folder') yield* this[key].values(true);
				else yield this[key];
			}
		} else {
			for (const key of this.keyArray) yield this[key];
		}
	}

	/**
	 * Returns a new Iterator object that contains the keys for each element contained in this folder.
	 * Identical to [Map.keys()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/keys)
	 * @since 0.5.0
	 * @param {boolean} recursive Whether the iteration should be recursive
	 * @yields {string}
	 */
	*keys(recursive = false) {
		if (recursive) {
			for (const key of this.keyArray) {
				if (this[key].type === 'Folder') yield* this[key].keys(true);
				else yield key;
			}
		} else {
			for (const key of this.keyArray) yield key;
		}
	}

	/**
	 * Returns a new Iterator object that contains the `[key, value]` pairs for each element contained in this folder.
	 * Identical to [Map.entries()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/entries)
	 * @name @@iterator
	 * @since 0.5.0
	 * @method
	 * @instance
	 * @generator
	 * @returns {Iterator<Array<string|SchemaFolder|SchemaPiece>>}
	 * @memberof SchemaFolder
	 */

	[Symbol.iterator]() {
		return this.entries();
	}

	/**
	 * Get a JSON object containing all the objects from this schema's children.
	 * @since 0.5.0
	 * @returns {Object}
	 */
	toJSON() {
		return Object.assign({ type: 'Folder' }, ...this.keyArray.map(key => ({ [key]: this[key].toJSON() })));
	}

	/**
	 * Stringify a value or the instance itself.
	 * @since 0.5.0
	 * @returns {string}
	 */
	toString() {
		return this.configurableKeys.length ? '{ Folder }' : '{ Empty Folder }';
	}

}

module.exports = SchemaFolder;
