const { isObject, makeObject, deepClone, tryParse, getIdentifier, toTitleCase, arraysEqual } = require('../util/util');
const SchemaFolder = require('./SchemaFolder');
const SchemaPiece = require('./SchemaPiece');
const invalidValue = Symbol('invalid');

/**
 * <warning>Creating your own Configuration instances if often discouraged and unneeded. SettingGateway handles them internally for you.</warning>
 * The Configuration class that stores the cache for each entry in SettingGateway.
 */
class Configuration {

	/**
	 * @typedef {Object} ConfigurationUpdateResult
	 * @property {*} value The parsed value
	 * @property {SchemaPiece} path The SchemaPiece that manages the updated value
	 * @memberof Configuration
	 */

	/**
	 * @typedef {Object} ConfigurationUpdateOptions
	 * @property {boolean} [avoidUnconfigurable] Whether the update should avoid unconfigurable keys
	 * @property {('add'|'remove'|'auto')} [action='auto'] Whether the update (when using arrays) should add or remove,
	 * leave it as 'auto' to add or remove depending on the existence of the key in the array
	 * @property {number} [arrayPosition] The position of the array to replace
	 * @memberof Configuration
	 */

	/**
	 * @typedef {Object} ConfigurationUpdateObjectResult
	 * @property {ConfigurationUpdateObjectList} updated An object containing all keys and values updated
	 * @property {Error[]} errors All the errors caught by the parser
	 * @memberof Configuration
	 */

	/**
	 * @typedef {Object} ConfigurationUpdateObjectList
	 * @property {string[]} keys An array of all updated keys
	 * @property {Array<*>} values An array of all updated values
	 * @memberof Configuration
	 */

	/**
	 * @typedef {Object} ConfigurationPathResult
	 * @property {string} path The path of the updated key
	 * @property {string[]} route The path split by dots
	 * @memberof Configuration
	 * @private
	 */

	/**
	 * @typedef {Object} ConfigurationUpdateManyList
	 * @property {Error[]} errors An array containing all the errors caught
	 * @property {Array<Promise<*>>} promises An array of promises to resolve
	 * @property {string[]} keys An array of all keys pending for update
	 * @property {Array<*>} values An array of all values pending for update
	 * @memberof Configuration
	 * @private
	 */

	/**
	 * @typedef {Object} ConfigurationParseResult
	 * @property {*} parsed The parsed value
	 * @property {(string|number|object)} parsedID The parsed ID value for DB storage
	 * @property {(null|Array<*>)} array The updated array. Can be null if the key doesn't hold an array
	 * @property {string} path The path of the updated key
	 * @property {string[]} route The path split by dots
	 * @memberof Configuration
	 * @private
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

		const { schema } = this.gateway;
		for (let i = 0; i < schema.keyArray.length; i++) {
			const key = schema.keyArray[i];
			this[key] = Configuration._merge(data[key], schema[key]);
		}
	}

	/**
	 * Get a value from the configuration. Admits nested objects separating by comma.
	 * @since 0.5.0
	 * @param {string} key The key to get from this instance
	 * @returns {*}
	 */
	get(key) {
		if (!key.includes('.')) return this.gateway.schema.has(key) ? this[key] : undefined;

		const path = key.split('.');
		let refSetting = this; // eslint-disable-line consistent-this
		let refSchema = this.gateway.schema;
		for (const currKey of path) {
			if (refSchema.type !== 'Folder' || !refSchema.has(currKey)) return undefined;
			refSetting = refSetting[currKey];
			refSchema = refSchema[currKey];
		}

		return refSetting;
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
		this._syncStatus = this.gateway.provider.get(this.gateway.type, this.id);
		this._syncStatus.then(() => { this._syncStatus = null; });
		const data = await this._syncStatus.catch(() => null);
		if (data) {
			if (!this._existsInDB) this._existsInDB = true;
			this._patch(data);
		}
		return this;
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
	 * @param {(string|string[])} [resetKey] The key to reset
	 * @param {boolean} [avoidUnconfigurable] Whether the Gateway should avoid configuring the selected key
	 * @returns {ConfigurationUpdateResult|ConfigurationUpdateObjectList}
	 * // Reset all keys for this instance
	 * Configuration#reset();
	 *
	 * // Reset multiple keys for this instance
	 * Configuration#reset(['prefix', 'channels.modlog']);
	 *
	 * // Reset a key
	 * Configuration#reset('prefix');
	 */
	async reset(resetKey, avoidUnconfigurable) {
		if (typeof resetKey === 'undefined') resetKey = [...this.gateway.schema.keys(true)];
		if (Array.isArray(resetKey)) {
			// Handle entry creation if it does not exist.
			if (!this._existsInDB) return { keys: [], values: [] };

			const oldClone = this.client.listenerCount('configUpdateEntry') ? this.clone() : null;
			const list = { keys: [], values: [] };
			this._resetKeys(resetKey, list);

			if (list.keys.length) {
				if (oldClone !== null) this.client.emit('configUpdateEntry', oldClone, this, list.keys);
				if (this.gateway.sql) {
					await this.gateway.provider.update(this.gateway.type, this.id, list.keys, list.values);
				} else {
					const updateObject = Object.assign({}, ...list.keys.map((key, i) => makeObject(key, list.values[i])));
					await this.gateway.provider.update(this.gateway.type, this.id, updateObject);
				}
			}

			return { keys: list.keys, values: list.values };
		}
		const { parsedID, parsed, path } = await this._reset(resetKey, typeof avoidUnconfigurable !== 'boolean' ? false : avoidUnconfigurable);
		await (this.gateway.sql ?
			this.gateway.provider.update(this.gateway.type, this.id, resetKey, parsedID) :
			this.gateway.provider.update(this.gateway.type, this.id, makeObject(resetKey, parsedID)));
		return { value: parsed, path };
	}

	/**
	 * Update a value from an entry.
	 * @since 0.5.0
	 * @param {(string|Object)} key The key to modify
	 * @param {*} [value] The value to parse and save
	 * @param {GuildResolvable} [guild] A guild resolvable
	 * @param {ConfigurationUpdateOptions} [options={}] The options for the update
	 * @returns {Promise<(ConfigurationUpdateResult|ConfigurationUpdateObjectList)>}
	 * @throws {Promise<ConfigurationUpdateObjectResult>}
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
	 * // Updating multiple keys (only possible with json object):
	 * Configuration#update({ prefix: 'k!', language: 'es-ES' }, msg.guild);
	 */
	update(key, value, guild, options) {
		if (typeof options === 'undefined' && isObject(guild)) {
			options = guild;
			guild = undefined;
		}
		if (guild) guild = this.gateway._resolveGuild(guild);

		if (isObject(key)) return this._updateMany(key, value);
		return this._updateSingle(key, value, guild, options);
	}

	/**
	 * Get a list.
	 * @since 0.5.0
	 * @param {KlasaMessage} msg The Message instance
	 * @param {(SchemaFolder|string)} path The path to resolve
	 * @returns {string}
	 */
	list(msg, path) {
		const folder = path instanceof SchemaFolder ? path : this.gateway.getPath(path, { piece: false }).path;
		const array = [];
		const folders = [];
		const keys = {};
		let longest = 0;
		for (const [key, value] of folder.entries()) {
			if (value.type === 'Folder') {
				folders.push(`// ${key}`);
			} else if (value.configurable) {
				if (!(value.type in keys)) keys[value.type] = [];
				if (key.length > longest) longest = key.length;
				keys[value.type].push(key);
			}
		}
		const keysTypes = Object.keys(keys);
		if (folders.length === 0 && keysTypes.length === 0) return '';
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
		const piece = path instanceof SchemaPiece ? path : this.gateway.getPath(path, { piece: true }).path;
		const value = this.get(piece.path);
		if (value === null) return 'Not set';
		if (piece.array && value.length === 0) return 'None';

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
	 * Resets all keys recursively
	 * @since 0.5.0
	 * @param {string[]} keys The SchemaFolder to iterate
	 * @param {ConfigurationUpdateManyList} list The list
	 * @private
	 */
	_resetKeys(keys, list) {
		for (const key of keys) {
			const { path, route } = this.gateway.getPath(key, { piece: true });

			let self = this; // eslint-disable-line consistent-this
			for (let i = 0; i < route.length - 1; i++) self = self[route[i]] || {};
			const currentValue = self[route[route.length - 1]];

			const value = (path.array ? !arraysEqual(currentValue, path.default, true) : currentValue !== path.default) ?
				deepClone(path.default) :
				invalidValue;
			if (value === invalidValue) continue;

			self[route[route.length - 1]] = value;

			list.keys.push(path.path);
			list.values.push(value);
		}
	}

	/**
	 * Update multiple keys given a JSON object.
	 * @since 0.5.0
	 * @param {Object} object A JSON object to iterate and parse
	 * @param {GuildResolvable} [guild] A guild resolvable
	 * @returns {ConfigurationUpdateObjectList}
	 * @throws {ConfigurationUpdateObjectResult}
	 * @private
	 */
	async _updateMany(object, guild) {
		const list = { errors: [], promises: [], keys: [], values: [] };

		// Handle entry creation if it does not exist.
		if (!this._existsInDB) await this.gateway.createEntry(this.id);

		const oldClone = this.client.listenerCount('configUpdateEntry') ? this.clone() : null;
		const updateObject = {};
		this._parseUpdateMany(this, object, this.gateway.schema, guild, list, updateObject);
		await Promise.all(list.promises);

		if (oldClone !== null) this.client.emit('configUpdateEntry', oldClone, this, list.keys);
		if (this.gateway.sql) await this.gateway.provider.update(this.gateway.type, this.id, list.keys, list.values);
		else await this.gateway.provider.update(this.gateway.type, this.id, updateObject);
		if (list.errors.length) throw { updated: { keys: list.keys, values: list.values }, errors: list.errors };
		return { keys: list.keys, values: list.values };
	}

	/**
	 * Reset a value from an entry.
	 * @since 0.5.0
	 * @param {string} key The key to reset
	 * @param {boolean} avoidUnconfigurable Whether the Gateway should avoid configuring the selected key
	 * @returns {ConfigurationParseResult}
	 * @private
	 */
	async _reset(key, avoidUnconfigurable) {
		if (typeof key !== 'string') throw new TypeError(`The argument key must be a string. Received: ${typeof key}`);
		const pathData = this.gateway.getPath(key, { avoidUnconfigurable, piece: true });
		return this._parseReset(key, pathData);
	}

	/**
	 * Parse the data for reset.
	 * @since 0.5.0
	 * @param {string} key The key to edit
	 * @param {ConfigurationPathResult} options The options
	 * @returns {ConfigurationParseResult}
	 * @private
	 */
	async _parseReset(key, { path, route }) {
		const parsedID = deepClone(path.default);
		await this._setValue(parsedID, path, route);
		return { parsed: parsedID, parsedID, array: null, path, route };
	}

	/**
	 * Update a single key
	 * @since 0.5.0
	 * @param {string} key The key to edit
	 * @param {*} value The new value
	 * @param {GuildResolvable} guild The guild to take
	 * @param {ConfigurationPathResult} options The options
	 * @returns {ConfigurationParseResult}
	 * @private
	 */
	async _parseUpdateOne(key, value, guild, { path, route }) {
		if (path.array === true) throw 'This key is array type.';

		const parsed = await path.parse(value, guild);
		const parsedID = getIdentifier(parsed);
		await this._setValue(parsedID, path, route);
		return { parsed, parsedID, array: null, path, route };
	}

	/**
	 * Update an array
	 * @since 0.5.0
	 * @param {('add'|'remove'|'auto')} action Whether the value should be added or removed to the array
	 * @param {string} key The key to edit
	 * @param {*} value The new value
	 * @param {GuildResolvable} guild The guild to take
	 * @param {number} arrayPosition The array position to update
	 * @param {ConfigurationPathResult} options The options
	 * @returns {ConfigurationParseResult}
	 * @private
	 */
	async _parseUpdateArray(action, key, value, guild, arrayPosition, { path, route }) {
		if (path.array === false) {
			if (guild) throw guild.language.get('COMMAND_CONF_KEY_NOT_ARRAY');
			throw new Error('The key is not an array.');
		}

		const parsed = await path.parse(value, guild);
		const parsedID = path.type !== 'any' ? getIdentifier(parsed) : parsed;

		// Handle entry creation if it does not exist.
		if (!this._existsInDB) await this.gateway.createEntry(this.id);
		const oldClone = this.client.listenerCount('configUpdateEntry') ? this.clone() : null;

		let cache = this; // eslint-disable-line consistent-this
		for (let i = 0; i < route.length - 1; i++) cache = cache[route[i]] || {};
		cache = cache[route[route.length - 1]] || [];

		if (typeof arrayPosition === 'number') {
			if (arrayPosition >= cache.length) throw new Error(`The option arrayPosition should be a number between 0 and ${cache.length - 1}`);
			cache[arrayPosition] = parsedID;
		} else {
			if (action === 'auto') action = cache.includes(parsedID) ? 'remove' : 'add';
			if (action === 'add') {
				if (cache.includes(parsedID)) throw `The value ${parsedID} for the key ${path.path} already exists.`;
				cache.push(parsedID);
			} else {
				const index = cache.indexOf(parsedID);
				if (index === -1) throw `The value ${parsedID} for the key ${path.path} does not exist.`;
				cache.splice(index, 1);
			}
		}

		if (oldClone !== null) this.client.emit('configUpdateEntry', oldClone, this, [path.path]);
		return { parsed, parsedID, array: cache, path, route };
	}

	/**
	 * Update an array
	 * @since 0.5.0
	 * @param {string} key The key to edit
	 * @param {*} value The new value
	 * @param {GuildResolvable} guild The guild to take
	 * @param {Object} [options={}] The options
	 * @param {boolean} [options.avoidUnconfigurable=false] Whether the Gateway should avoid configuring the selected key
	 * @param {('add'|'remove'|'auto')} [options.action='auto'] Whether the value should be added or removed to the array
	 * @param {number} [options.arrayPosition=null] The array position to update
	 * @returns {ConfigurationUpdateResult}
	 * @private
	 */
	async _updateSingle(key, value, guild, { avoidUnconfigurable = false, action = 'auto', arrayPosition = null } = {}) {
		if (typeof key !== 'string') throw new TypeError(`The argument key must be a string. Received: ${typeof key}`);
		if (typeof guild === 'boolean') {
			avoidUnconfigurable = guild;
			guild = undefined;
		}

		const pathData = this.gateway.getPath(key, { avoidUnconfigurable, piece: true });
		if (action === 'remove' && !pathData.path.array) return this._parseReset(key, pathData);
		const { parsedID, array, parsed } = value === null || (action === 'remove' && !pathData.path.array) ?
			this._parseReset(key, pathData) :
			pathData.path.array === true ?
				await this._parseUpdateArray(action, key, value, guild, arrayPosition, pathData) :
				await this._parseUpdateOne(key, value, guild, pathData);

		if (this.gateway.sql) await this.gateway.provider.update(this.gateway.type, this.id, key, array || parsedID);
		else await this.gateway.provider.update(this.gateway.type, this.id, makeObject(key, array || parsedID));

		return { value: parsed, path: pathData.path };
	}

	/**
	 * Update many keys in a single query.
	 * @since 0.5.0
	 * @param {Object} cache The key target
	 * @param {Object} object The key to edit
	 * @param {SchemaFolder} schema The new value
	 * @param {GuildResolvable} guild The guild to take
	 * @param {ConfigurationUpdateManyList} list The options
	 * @param {*} updateObject The object to update
	 * @private
	 */
	_parseUpdateMany(cache, object, schema, guild, list, updateObject) {
		for (const key of Object.keys(object)) {
			if (!schema.has(key)) continue;
			// Check if it's a folder, and recursively iterate over it
			if (schema[key].type === 'Folder') {
				if (!(key in updateObject)) updateObject = updateObject[key] = {};
				this._parseUpdateMany(cache[key], object[key], schema[key], guild, list, updateObject);
				// If the value is null, reset it
			} else if (object[key] === null) {
				list.promises.push(this.reset(key)
					.then(({ value, path }) => {
						updateObject[key] = cache[key] = value;
						list.keys.push(path);
						list.values.push(value);
					})
					.catch(error => list.errors.push([schema.path, error])));
				// Throw an error if it's not array (nor type any) but an array was given
			} else if (!schema[key].array && schema[key].type !== 'any' && Array.isArray(object[key])) {
				list.errors.push([schema[key].path, new Error(`${schema[key].path} does not expect an array as value.`)]);
				// Throw an error if the key requests an array and none is given
			} else if (schema[key].array && !Array.isArray(object[key])) {
				list.errors.push([schema[key].path, new Error(`${schema[key].path} expects an array as value.`)]);
			} else {
				const promise = schema[key].array && schema[key].type !== 'any' ?
					Promise.all(object[key].map(entry => schema[key].parse(entry, guild)
						.then(getIdentifier)
						.catch(error => list.errors.push([schema[key].path, error])))) :
					schema[key].parse(object[key], guild);

				list.promises.push(promise
					.then(parsed => {
						const parsedID = schema[key].array ?
							parsed.filter(entry => typeof entry !== 'undefined') :
							getIdentifier(parsed);
						updateObject[key] = cache[key] = parsedID;
						list.keys.push(schema[key].path);
						list.values.push(parsedID);
					})
					.catch(error => list.errors.push([schema.path, error])));
			}
		}
	}

	/**
	 * Set a value at a certain path
	 * @since 0.5.0
	 * @param {string} parsedID The parsed ID or result
	 * @param {SchemaPiece} path The SchemaPiece which handles the key to modify
	 * @param {string[]} route The route of the key to modify
	 * @private
	 */
	async _setValue(parsedID, path, route) {
		// Handle entry creation if it does not exist.
		if (!this._existsInDB) await this.gateway.createEntry(this.id);
		const oldClone = this.client.listenerCount('configUpdateEntry') ? this.clone() : null;

		let cache = this; // eslint-disable-line consistent-this
		for (let i = 0; i < route.length - 1; i++) cache = cache[route[i]] || {};
		cache[route[route.length - 1]] = parsedID;

		if (oldClone !== null) this.client.emit('configUpdateEntry', oldClone, this, [path.path]);
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
		for (let i = 0; i < schema.keyArray.length; i++) {
			const key = schema.keyArray[i];
			if (typeof data[key] === 'undefined') continue;
			this[key] = schema[key].type === 'Folder' ?
				Configuration._patch(this[key], data[key], schema[key]) :
				data[key];
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
		if (schema.type === 'Folder') {
			if (!data) data = {};
			for (const [key, piece] of schema.entries()) {
				if (!data[key]) data[key] = {};
				Configuration._merge(data[key], piece);
			}
		} else if (typeof data === 'undefined') {
			// It's a SchemaPiece instance, so it has a property of 'key'.
			data = deepClone(schema.default);
		} else if (schema.array) {
			if (Array.isArray(data)) return data;
			// Some SQL databases are unable to store Arrays...
			if (data === null) return deepClone(schema.default);
			if (typeof data === 'string') return tryParse(data);
			schema.client.emit('wtf',
				new TypeError(`${schema.path} | Expected an array, null, or undefined. Got: ${Object.prototype.toString.call(data)}`));
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

		for (let i = 0; i < schema.keyArray.length; i++) {
			const key = schema.keyArray[i];
			if (schema[key].type === 'Folder') clone[key] = Configuration._clone(data[key], schema[key]);
			else clone[key] = deepClone(data[key]);
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
		for (const key of schema.keys()) {
			if (typeof data[key] === 'undefined') continue;
			inst[key] = schema[key].type === 'Folder' ?
				Configuration._patch(inst[key], data[key], schema[key]) :
				data[key];
		}

		return inst;
	}

}

module.exports = Configuration;
