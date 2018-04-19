const { isObject, makeObject, deepClone, tryParse, toTitleCase, arraysEqual, mergeObjects, getDeepTypeName, objectToTuples } = require('../util/util');
const SchemaFolder = require('./SchemaFolder');
const SchemaPiece = require('./SchemaPiece');

/**
 * <warning>Creating your own Configuration instances is often discouraged and unneeded. SettingGateway handles them internally for you.</warning>
 * The Configuration class that stores the cache for each entry in SettingGateway.
 */
class Configuration {

	/**
	 * @typedef {Object} ConfigurationUpdateResult
	 * @property {Error[]} errors The errors caught from parsing
	 * @property {ConfigurationUpdateResultEntry[]} updated The updated keys
	 */

	/**
	 * @typedef {Object} ConfigurationUpdateResultEntry
	 * @property {any[]} data A tuple containing the path of the updated key and the new value
	 * @property {SchemaPiece} piece The SchemaPiece instance that manages the updated key
	 */

	/**
	 * @typedef {Object} ConfigurationUpdateOptions
	 * @property {boolean} [avoidUnconfigurable] Whether the update should avoid unconfigurable keys
	 * @property {('add'|'remove'|'auto')} [action='auto'] Whether the update (when using arrays) should add or remove,
	 * leave it as 'auto' to add or remove depending on the existence of the key in the array
	 * @property {number} [arrayPosition] The position of the array to replace
	 */

	/**
	 * @since 0.5.0
	 * @param {Gateway} manager The Gateway that manages this Configuration instance
	 * @param {Object} data The data that is cached in this Configuration instance
	 */
	constructor(manager, data) {
		/**
		 * The client this Configuration was created with.
		 * @since 0.5.0
		 * @type {KlasaClient}
		 * @name Configuration#client
		 * @readonly
		 */
		Object.defineProperty(this, 'client', { value: manager.client });

		/**
		 * The Gateway that manages this Configuration instance.
		 * @since 0.5.0
		 * @type {Gateway}
		 * @name Configuration#gateway
		 * @readonly
		 */
		Object.defineProperty(this, 'gateway', { value: manager });

		/**
		 * The ID that identifies this instance.
		 * @since 0.5.0
		 * @type {string}
		 * @name Configuration#id
		 * @readonly
		 */
		Object.defineProperty(this, 'id', { value: data.id });

		/**
		 * Whether this entry exists in the DB or not.
		 * @since 0.5.0
		 * @type {boolean}
		 * @name Configuration#_existsInDB
		 * @private
		 */
		Object.defineProperty(this, '_existsInDB', { value: false, writable: true });

		/**
		 * The sync status for this Configuration instance.
		 * @since 0.5.0
		 * @type {Promise}
		 * @name Configuration#_syncStatus
		 * @private
		 */
		Object.defineProperty(this, '_syncStatus', { value: null, writable: true });

		Configuration._merge(data, this.gateway.schema);
		for (const key of this.gateway.schema.keys()) this[key] = data[key];
	}

	/**
	 * Get a value from the configuration. Admits nested objects separating by comma.
	 * @since 0.5.0
	 * @param {string} key The key to get from this instance
	 * @returns {*}
	 */
	get(key) {
		if (!key.includes('.')) return this.gateway.schema.has(key) ? this[key] : undefined;
		return this._get(key.split('.'), true);
	}

	/**
	 * Clone this instance.
	 * @since 0.5.0
	 * @returns {Configuration}
	 */
	clone() {
		return new this.gateway.Configuration(this.gateway, this.gateway.Configuration._clone(this, this.gateway.schema));
	}

	/**
	 * Sync the data from the database with the cache.
	 * @since 0.5.0
	 * @returns {this}
	 */
	async sync() {
		if (!this._syncStatus) this._syncStatus = this._sync();
		return this._syncStatus;
	}

	/**
	 * Delete this entry from the database and cache.
	 * @since 0.5.0
	 * @returns {this}
	 */
	async destroy() {
		if (this._existsInDB) {
			await this.gateway.provider.delete(this.gateway.type, this.id);
			if (this.client.listenerCount('configDeleteEntry')) this.client.emit('configDeleteEntry', this);
		}
		this.gateway.cache.delete(this.id);
		return this;
	}

	/**
	 * Reset a value from an entry.
	 * @since 0.5.0
	 * @param {(string|string[])} [keys] The key to reset
	 * @param {KlasaGuild} [guild] A KlasaGuild instance for multilingual support
	 * @param {boolean} [avoidUnconfigurable] Whether the Gateway should avoid configuring the selected key
	 * @returns {ConfigurationUpdateResult}
	 * @example
	 * // Reset all keys for this instance
	 * Configuration#reset();
	 *
	 * // Reset multiple keys for this instance
	 * Configuration#reset(['prefix', 'channels.modlog']);
	 *
	 * // Reset a key
	 * Configuration#reset('prefix');
	 */
	async reset(keys, guild, avoidUnconfigurable = false) {
		if (typeof guild === 'boolean') {
			avoidUnconfigurable = guild;
			guild = undefined;
		}

		// If the entry does not exist in the DB, it'll never be able to reset a key
		if (!this._existsInDB) return { errors: [], updated: [] };

		if (typeof keys === 'string') keys = [keys];
		else if (typeof keys === 'undefined') keys = [...this.gateway.schema.values(true)].map(piece => piece.path);
		if (Array.isArray(keys)) {
			const result = { errors: [], updated: [] };
			const entries = new Array(keys.length);
			for (let i = 0; i < keys.length; i++) entries[i] = [keys[i], null];
			for (const [key, value] of entries) {
				const path = this.gateway.getPath(key, { piece: true, avoidUnconfigurable, errors: false });
				if (!path) {
					result.errors.push(guild && guild.language ?
						guild.language.get('COMMAND_CONF_GET_NOEXT', key) :
						`The path ${key} does not exist in the current schema, or does not correspond to a piece.`);
					continue;
				}
				const newValue = value === null ? deepClone(path.piece.default) : value;
				if (this._setValueByPath(path.piece, newValue).updated) result.updated.push({ data: [path.piece.path, newValue], piece: path.piece });
			}
			if (result.updated.length) await this._save(result);
			return result;
		}
		throw new TypeError(`Invalid value. Expected string or Array<string>. Got: ${getDeepTypeName(keys)}`);
	}

	/**
	 * Update a value from an entry.
	 * @since 0.5.0
	 * @param {(string|Object)} keys The key to modify
	 * @param {*} [values] The value to parse and save
	 * @param {GuildResolvable} [guild=null] A guild resolvable
	 * @param {ConfigurationUpdateOptions} [options={}] The options for the update
	 * @returns {ConfigurationUpdateResult}
	 * @example
	 * // Updating the value of a key
	 * Configuration#update('roles.administrator', '339943234405007361', msg.guild);
	 *
	 * // Updating an array:
	 * Configuration#update('userBlacklist', '272689325521502208');
	 *
	 * // Ensuring the function call adds (error if it exists):
	 * Configuration#update('userBlacklist', '272689325521502208', { action: 'add' });
	 *
	 * // Updating it with a json object:
	 * Configuration#update({ roles: { administrator: '339943234405007361' } }, msg.guild);
	 *
	 * // Updating multiple keys (with json object):
	 * Configuration#update({ prefix: 'k!', language: 'es-ES' }, msg.guild);
	 *
	 * // Updating multiple keys (with arrays):
	 * Configuration#update(['prefix', 'language'], ['k!', 'es-ES']);
	 */
	update(keys, values, guild, options) {
		// Overload update(object, GuildResolvable);
		if (isObject(keys)) {
			[guild, options] = [values, guild];
			[keys, values] = objectToTuples(keys);
		} else if (typeof keys === 'string') {
			// Overload update(string|string[], any|any[], ...any[]);
			keys = [keys];
			values = [values];
		} else if (!Array.isArray(keys)) {
			throw new TypeError(`Invalid value. Expected object, string or Array<string>. Got: ${getDeepTypeName(keys)}`);
		}

		// Overload update(string|string[], any|any[], ConfigurationUpdateOptions);
		// Overload update(string|string[], any|any[], GuildResolvable, ConfigurationUpdateOptions);
		// If the third argument is undefined and the second is an object literal, swap the variables.
		if (typeof options === 'undefined' && guild && guild.constructor.name === 'Object') [guild, options] = [null, guild];
		if (guild) guild = this.gateway._resolveGuild(guild);
		if (!options) options = {};

		// Do a length check on both keys and values before trying to update
		if (keys.length !== values.length) throw new Error(`Expected an array of ${keys.length} entries. Got: ${values.length}.`);

		const updateOptions = {
			avoidUnconfigurable: 'avoidUnconfigurable' in options ? options.avoidUnconfigurable : false,
			action: 'action' in options ? options.action : 'auto',
			arrayPosition: 'arrayPosition' in options ? options.arrayPosition : null
		};
		return this._update(keys, values, guild, updateOptions);
	}

	/**
	 * Get a list.
	 * @since 0.5.0
	 * @param {KlasaMessage} msg The Message instance
	 * @param {(SchemaFolder|string)} path The path to resolve
	 * @returns {string}
	 */
	list(msg, path) {
		const folder = path instanceof SchemaFolder ? path : this.gateway.getPath(path, { piece: false }).piece;
		const array = [];
		const folders = [];
		const keys = {};
		let longest = 0;
		for (const [key, value] of folder.entries()) {
			if (value.type === 'Folder') {
				if (value.configurableKeys.length) folders.push(`// ${key}`);
			} else if (value.configurable) {
				if (!(value.type in keys)) keys[value.type] = [];
				if (key.length > longest) longest = key.length;
				keys[value.type].push(key);
			}
		}
		const keysTypes = Object.keys(keys);
		if (!folders.length && !keysTypes.length) return '';
		if (folders.length) array.push('= Folders =', ...folders.sort(), '');
		if (keysTypes.length) {
			for (const keyType of keysTypes.sort()) {
				keys[keyType].sort();
				array.push(`= ${toTitleCase(keyType)}s =`);
				for (const key of keys[keyType]) array.push(`${key.padEnd(longest)} :: ${this.resolveString(msg, folder[key])}`);
				array.push('');
			}
		}
		return array.join('\n');
	}

	/**
	 * Resolve a string.
	 * @since 0.5.0
	 * @param {KlasaMessage} msg The Message to use
	 * @param {(SchemaPiece|string)} path The path to resolve
	 * @returns {string}
	 * @private
	 */
	resolveString(msg, path) {
		const piece = path instanceof SchemaPiece ? path : this.gateway.getPath(path, { piece: true }).piece;
		const value = this.get(piece.path);
		if (value === null) return 'Not set';
		if (piece.array && !value.length) return 'None';

		let resolver;
		switch (piece.type) {
			case 'Folder': resolver = () => 'Folder';
				break;
			case 'user': resolver = (val) => (this.client.users.get(val) || { username: (val && val.username) || val }).username;
				break;
			case 'categorychannel':
			case 'textchannel':
			case 'voicechannel':
			case 'channel': resolver = (val) => (msg.guild.channels.get(val) || { name: (val && val.name) || val }).name;
				break;
			case 'role': resolver = (val) => (msg.guild.roles.get(val) || { name: (val && val.name) || val }).name;
				break;
			case 'guild': resolver = (val) => (val && val.name) || val;
				break;
			case 'boolean': resolver = (val) => val ? 'Enabled' : 'Disabled';
				break;
			default:
				resolver = (val) => val;
		}

		if (piece.array) return `[ ${value.map(resolver).join(' | ')} ]`;
		return resolver(value);
	}

	/**
	 * Sync the entry with the database
	 * @since 0.5.0
	 * @returns {this}
	 */
	async _sync() {
		const data = await this.gateway.provider.get(this.gateway.type, this.id);
		if (data) {
			if (!this._existsInDB) this._existsInDB = true;
			this._patch(data);
		}

		this._syncStatus = null;
		return this;
	}

	/**
	 * Get a value from the cache.
	 * @since 0.5.0
	 * @param {(string|string[])} route The route to get
	 * @param {boolean} piece Whether the get should resolve a piece or a folder
	 * @returns {*}
	 * @private
	 */
	_get(route, piece = true) {
		if (typeof route === 'string') route = route.split('.');
		let refCache = this, refSchema = this.gateway.schema; // eslint-disable-line consistent-this
		for (const key of route) {
			if (refSchema.type !== 'Folder' || !refSchema.has(key)) return undefined;
			refCache = refCache[key];
			refSchema = refSchema[key];
		}

		return piece && refSchema.type !== 'Folder' ? refCache : undefined;
	}

	/**
	 * Update this Configuration instance
	 * @since 0.5.0
	 * @param {string[]} keys The keys to update
	 * @param {Array<*>} values The values to update
	 * @param {?KlasaGuild} guild The KlasaGuild for context in SchemaPiece#parse
	 * @param {ConfigurationUpdateOptions} options The parse options
	 * @returns {ConfigurationUpdateResult}
	 * @private
	 */
	async _update(keys, values, guild, options) {
		const result = { errors: [], updated: [] };
		const pathOptions = { piece: true, avoidUnconfigurable: options.avoidUnconfigurable, errors: false };
		const promises = [];
		for (let i = 0; i < keys.length; i++) {
			const key = keys[i], value = values[i];
			const path = this.gateway.getPath(key, pathOptions);
			if (!path) {
				result.errors.push(guild && guild.language ?
					guild.language.get('COMMAND_CONF_GET_NOEXT', key) :
					`The path ${key} does not exist in the current schema, or does not correspond to a piece.`);
				continue;
			}
			if (!path.piece.array && Array.isArray(value)) {
				result.errors.push(guild && guild.language ?
					guild.language.get('SETTING_GATEWAY_KEY_NOT_ARRAY', key) :
					`The path ${key} does not store multiple values.`);
				continue;
			}
			promises.push(this._parse(value, guild, options, result, path));
		}
		if (promises.length) {
			await Promise.all(promises);
			await this._save(result);
		}

		return result;
	}

	/**
	 * Parse a value
	 * @since 0.5.0
	 * @param {*} value The value to parse
	 * @param {?KlasaGuild} guild The KlasaGuild for context in SchemaPiece#parse
	 * @param {ConfigurationUpdateOptions} options The parse options
	 * @param {ConfigurationUpdateResult} result The updated result
	 * @param {GatewayGetPathResult} path The path result
	 * @private
	 */
	async _parse(value, guild, options, result, { piece, route }) {
		const parsedID = value !== null ?
			await (Array.isArray(value) ? this._parseAll(piece, value, guild, result.errors) : piece.parse(value, guild)) :
			deepClone(piece.default);

		if (piece.array && !Array.isArray(value)) {
			this._parseArraySingle(piece, route, parsedID, options, result);
		} else if (this._setValueByPath(piece, parsedID).updated) {
			result.updated.push({ data: [piece.path, parsedID], piece });
		}
	}

	/**
	 * Save the data to the database.
	 * @since 0.5.0
	 * @param {ConfigurationUpdateResult} result The data to save
	 * @private
	 */
	async _save({ updated }) {
		if (!updated.length) return;
		if (!this._existsInDB) {
			await this.gateway.provider.create(this.gateway.type, this.id);
			if (this.client.listenerCount('configCreateEntry')) this.client.emit('configCreateEntry', this);
		}
		const oldClone = this.client.listenerCount('configUpdateEntry') ? this.clone() : null;

		if (this.gateway.sql) {
			const keys = new Array(updated.length), values = new Array(updated.length);
			for (let i = 0; i < updated.length; i++) [keys[i], values[i]] = updated[i].data;
			await this.gateway.provider.update(this.gateway.type, this.id, keys, values);
		} else {
			const updateObject = {};
			for (const entry of updated) mergeObjects(updateObject, makeObject(entry.data[0], entry.data[1]));
			await this.gateway.provider.update(this.gateway.type, this.id, updateObject);
		}

		if (oldClone !== null) this.client.emit('configUpdateEntry', oldClone, this, updated);
	}

	/**
	 * Parse a single value for an array
	 * @since 0.5.0
	 * @param {SchemaPiece} piece The SchemaPiece pointer that parses this entry
	 * @param {string[]} route The path bits for property accessment
	 * @param {*} parsedID The parsed value
	 * @param {ConfigurationUpdateOptions} options The parse options
	 * @param {ConfigurationUpdateResult} result The updated result
	 * @private
	 */
	_parseArraySingle(piece, route, parsedID, { action, arrayPosition }, { updated, errors }) {
		const lengthErrors = errors.length;
		const array = this._get(route, true);
		if (typeof arrayPosition === 'number') {
			if (arrayPosition >= array.length) errors.push(new Error(`The option arrayPosition should be a number between 0 and ${array.length - 1}`));
			else array[arrayPosition] = parsedID;
		} else {
			if (action === 'auto') action = array.includes(parsedID) ? 'remove' : 'add';
			if (action === 'add') {
				if (array.includes(parsedID)) errors.push(new Error(`The value ${parsedID} for the key ${piece.path} already exists.`));
				else array.push(parsedID);
			} else {
				const index = array.indexOf(parsedID);
				if (index === -1) errors.push(new Error(`The value ${parsedID} for the key ${piece.path} does not exist.`));
				else array.splice(index, 1);
			}
		}
		if (errors.length === lengthErrors) updated.push({ data: [piece.path, array], piece });
	}

	/**
	 * Parse all values from an array
	 * @since 0.5.0
	 * @param {SchemaPiece} piece The SchemaPiece pointer that parses this entry
	 * @param {Array<*>} values The values to parse
	 * @param {?KlasaGuild} guild The KlasaGuild for context in SchemaPiece#parse
	 * @param {Error[]} errors The Errors array
	 * @returns {Array<number|string>}
	 * @private
	 */
	async _parseAll(piece, values, guild, errors) {
		const output = [];
		await Promise.all(values.map(value => piece.parse(value, guild)
			.then(parsed => output.push(parsed))
			.catch(error => errors.push(error))));

		return output;
	}

	/**
	 * Set a value by its path
	 * @since 0.5.0
	 * @param {SchemaPiece} piece The piece that manages the key
	 * @param {*} parsedID The parsed ID value
	 * @returns {{ updated: boolean, old: any }}
	 * @private
	 */
	_setValueByPath(piece, parsedID) {
		const path = piece.path.split('.');
		const lastKey = path.pop();
		let cache = this; // eslint-disable-line consistent-this
		for (const key of path) cache = cache[key] || {};
		const old = cache[lastKey];
		if (piece.array ? !arraysEqual(old, parsedID, true) : old !== parsedID) {
			cache[lastKey] = parsedID;
			return { updated: true, old };
		}
		return { updated: false, old };
	}

	/**
	 * Path this Configuration instance.
	 * @since 0.5.0
	 * @param {Object} data The data to patch
	 * @private
	 */
	_patch(data) {
		if (this.gateway.sql) data = this.gateway.parseEntry(data);
		const { schema } = this.gateway;
		for (const [key, piece] of schema) {
			const value = data[key];
			if (value === undefined || value === null) continue;
			this[key] = piece.type === 'Folder' ? Configuration._patch(this[key], value, piece) : value;
		}
	}

	/**
	 * Returns the JSON-compatible object of this instance.
	 * @since 0.5.0
	 * @returns {Object}
	 */
	toJSON() {
		return Configuration._clone(this, this.gateway.schema);
	}

	/**
	 * Returns a better string when an instance of this class gets stringified.
	 * @since 0.5.0
	 * @returns {string}
	 */
	toString() {
		return `Configuration(${this.gateway.type}:${this.id})`;
	}

	/**
	 * Assign data to the Configuration.
	 * @since 0.5.0
	 * @param {Object} data The data contained in the group
	 * @param {(SchemaFolder|SchemaPiece)} schema A SchemaFolder or a SchemaPiece instance
	 * @returns {Object}
	 * @private
	 */
	static _merge(data, schema) {
		for (const [key, piece] of schema) {
			if (piece.type === 'Folder') {
				if (!data[key]) data[key] = {};
				data[key] = Configuration._merge(data[key], piece);
			} else if (typeof data[key] === 'undefined' || data[key] === null) {
				data[key] = deepClone(piece.default);
			} else if (piece.array) {
				if (typeof data[key] === 'string') data[key] = tryParse(data[key]);
				if (Array.isArray(data[key])) continue;
				piece.client.emit('wtf',
					new TypeError(`${piece.path} | Expected an array, null, or undefined. Got: ${Object.prototype.toString.call(data[key])}`));
			}
		}

		return data;
	}

	/**
	 * Clone configs.
	 * @since 0.5.0
	 * @param {Object} data The data to clone
	 * @param {SchemaFolder} schema A SchemaFolder instance
	 * @returns {Object}
	 * @private
	 */
	static _clone(data, schema) {
		const clone = {};

		for (const [key, piece] of schema) {
			clone[key] = piece.type === 'Folder' ? Configuration._clone(data[key], piece) : deepClone(data[key]);
		}

		return clone;
	}

	/**
	 * Patch an object.
	 * @since 0.5.0
	 * @param {Object} inst The reference of the Configuration instance
	 * @param {Object} data The original object
	 * @param {SchemaFolder} schema A SchemaFolder instance
	 * @returns {Object}
	 * @private
	 */
	static _patch(inst, data, schema) {
		for (const [key, piece] of schema) {
			const value = data[key];
			if (value === undefined || value === null) continue;
			inst[key] = piece.type === 'Folder' ? Configuration._patch(inst[key], value, piece) : value;
		}

		return inst;
	}

}

module.exports = Configuration;
