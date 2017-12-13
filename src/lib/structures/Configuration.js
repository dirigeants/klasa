/**
 * The Configuration class that stores the cache for each entry in SettingGateway.
 */
class Configuration {

	/**
	 * @typedef  {Object} ConfigurationUpdateResult
	 * @property {*} value
	 * @property {SchemaPiece} path
	 * @memberof Configuration
	 */

	/**
	 * @typedef  {Object} ConfigurationParseOptions
	 * @property {string} path
	 * @property {string[]} route
	 * @memberof Configuration
	 */

	/**
	 * @typedef  {Object} ConfigurationParseResult
	 * @property {*} parsed
	 * @property {(string|number|object)} parsedID
	 * @property {null} array
	 * @property {string} path
	 * @property {string[]} route
	 * @property {string} entryID
	 * @memberof Configuration
	 */

	/**
	 * @typedef  {Object} ConfigurationParseResultArray
	 * @property {*} parsed
	 * @property {*} parsedID
	 * @property {any[]} array
	 * @property {string} path
	 * @property {string[]} route
	 * @property {string} entryID
	 * @memberof Configuration
	 */

	/**
	 * @typedef  {Object} ConfigurationUpdateManyList
	 * @property {Error[]} errors
	 * @property {Array<Promise<any>>} promises
	 * @property {string[]} keys
	 * @property {Array<*>} values
	 * @memberof Configuration
	 */

	/**
	 * @typedef  {Object} ConfigurationUpdateManyUpdated
	 * @property {string[]} keys
	 * @property {Array<*>} values
	 * @memberof Configuration
	 */

	/**
	 * @typedef  {Object} ConfigurationUpdateManyResult
	 * @property {ConfigurationUpdateManyUpdated} updated
	 * @property {Error[]} errors
	 * @memberof Configuration
	 */

	// { updated: { keys: list.keys, values: list.values }, errors: list.errors }

	/**
	 * @typedef {(KlasaGuild|KlasaMessage|external:TextChannel|external:VoiceChannel|external:CategoryChannel|external:Member|external:GuildChannel|external:Role)} GatewayGuildResolvable
	 * @memberof Configuration
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
		 * The type of the Gateway.
		 * @since 0.5.0
		 * @type {string}
		 * @name Configuration#type
		 * @readonly
		 */
		Object.defineProperty(this, 'type', { value: manager.type });

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
		 * @name Configuration#existsInDB
		 */
		Object.defineProperty(this, 'existsInDB', { value: false, writable: true });

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
		if (!key.includes('.')) return this.gateway.schema.hasKey(key) ? this[key] : undefined;

		const path = key.split('.');
		let refSetting = this; // eslint-disable-line consistent-this
		let refSchema = this.gateway.schema;
		for (let i = 0; i < path.length; i++) {
			const currKey = path[i];
			if (refSchema.type !== 'Folder' || !refSchema.hasKey(currKey)) return undefined;
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
		return new Configuration(this.gateway, Configuration._clone(this, this.gateway.schema));
	}

	/**
	 * Factory resets the current configuration.
	 * @since 0.5.0
	 * @returns {Promise<Configuration>}
	 */
	async resetConfiguration() {
		if (this.existsInDB) await this.gateway.provider.delete(this.gateway.type, this.id);
		for (const key of this.gateway.schema.keyArray) this[key] = Configuration._merge(undefined, this.gateway.schema[key]);
		return this;
	}

	/**
	 * Sync the data from the database with the cache.
	 * @since 0.5.0
	 * @returns {Promise<Configuration>}
	 */
	async sync() {
		const data = await this.gateway.provider.get(this.gateway.type, this.id);
		if (data) {
			if (!this.existsInDB) this.existsInDB = true;
			this._patch(data);
		}
		return this;
	}

	/**
	 * Delete this entry from the database and cache.
	 * @since 0.5.0
	 * @returns {Promise<Configuration>}
	 */
	async destroy() {
		await this.gateway.deleteEntry(this.id);
		return this;
	}

	/**
	 * Reset a value from an entry.
	 * @since 0.5.0
	 * @param {string} key The key to reset
	 * @param {boolean} [avoidUnconfigurable=false] Whether the Gateway should avoid configuring the selected key
	 * @returns {Promise<ConfigurationUpdateResult>}
	 */
	async reset(key, avoidUnconfigurable = false) {
		const { parsedID, parsed, path } = await this._reset(key, avoidUnconfigurable);
		await (this.gateway.sql ?
			this.gateway.provider.update(this.gateway.type, this.id, key, parsedID) :
			this.gateway.provider.update(this.gateway.type, this.id, this.toJSON()));
		return { value: parsed, path };
	}

	/**
	 * Update a value from an entry.
	 * @since 0.5.0
	 * @param {string} key The key to modify
	 * @param {*} value The value to parse and save
	 * @param {ConfigGuildResolvable} [guild] A guild resolvable
	 * @param {boolean} [avoidUnconfigurable=false] Whether the Gateway should avoid configuring the selected key
	 * @returns {Promise<ConfigurationUpdateResult>}
	 */
	updateOne(key, value, guild, avoidUnconfigurable = false) {
		return this._sharedUpdateSingle('add', key, value, guild, avoidUnconfigurable);
	}

	/**
	 * Update an array from an entry.
	 * @since 0.5.0
	 * @param {('add'|'remove')} action Whether the value should be added or removed to the array
	 * @param {string} key The key to modify
	 * @param {*} value The value to parse and save or remove
	 * @param {ConfigGuildResolvable} [guild] A guild resolvable
	 * @param {boolean} [avoidUnconfigurable=false] Whether the Gateway should avoid configuring the selected key
	 * @returns {Promise<ConfigurationUpdateResult>}
	 */
	async updateArray(action, key, value, guild, avoidUnconfigurable = false) {
		return this._sharedUpdateSingle(action, key, value, guild, avoidUnconfigurable);
	}

	/**
	 * Update multiple keys given a JSON object.
	 * @since 0.5.0
	 * @param {Object} object A JSON object to iterate and parse
	 * @param {ConfigGuildResolvable} [guild] A guild resolvable
	 * @returns {Promise<ConfigurationUpdateManyResult>}
	 */
	async updateMany(object, guild) {
		const list = { errors: [], promises: [], keys: [], values: [] };

		// Handle entry creation if it does not exist.
		if (!this.existsInDB) await this.gateway.createEntry(this.id);

		const oldClone = this.client.listenerCount('configUpdateEntry') ? this.clone() : null;
		this._updateMany(this, object, this.gateway.schema, guild, list);
		await Promise.all(list.promises);

		if (oldClone !== null) this.client.emit('configUpdateEntry', oldClone, this, { type: 'MANY', keys: list.keys, values: list.values });
		if (this.gateway.sql) await this.gateway.provider.update(this.gateway.type, this.id, list.keys, list.values);
		else await this.gateway.provider.update(this.gateway.type, this.id, this.toJSON());
		return { updated: { keys: list.keys, values: list.values }, errors: list.errors };
	}

	/**
	 * Reset a value from an entry.
	 * @since 0.5.0
	 * @param {string} key The key to reset
	 * @param {boolean} avoidUnconfigurable Whether the Gateway should avoid configuring the selected key
	 * @returns {Promise<ConfigurationParseResult>}
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
	 * @param {ConfigurationParseOptions} options The options
	 * @returns {Promise<ConfigurationParseResult>}
	 * @private
	 */
	async _parseReset(key, { path, route }) {
		const parsedID = path.default;
		await this._setValue(parsedID, path, route);
		return { parsed: parsedID, parsedID, array: null, path, route };
	}

	/**
	 * Update a single key
	 * @since 0.5.0
	 * @param {string} key The key to edit
	 * @param {*} value The new value
	 * @param {ConfigGuildResolvable} guild The guild to take
	 * @param {ConfigurationParseOptions} options The options
	 * @returns {Promise<ConfigurationParseResult>}
	 * @private
	 */
	async _parseUpdateOne(key, value, guild, { path, route }) {
		if (path.array === true) throw 'This key is array type.';
		guild = this.gateway._resolveGuild(guild);

		const parsed = await path.parse(value, guild);
		const parsedID = parsed && parsed.id ? parsed.id : parsed;
		await this._setValue(parsedID, path, route);
		return { parsed, parsedID, array: null, path, route };
	}

	/**
	 * Update an array
	 * @since 0.5.0
	 * @param {('add'|'remove')} action Whether the value should be added or removed to the array
	 * @param {string} key The key to edit
	 * @param {*} value The new value
	 * @param {ConfigGuildResolvable} guild The guild to take
	 * @param {ConfigurationParseOptions} options The options
	 * @returns {Promise<ConfigurationParseResultArray>}
	 * @private
	 */
	async _parseUpdateArray(action, key, value, guild, { path, route }) {
		if (path.array === false) {
			if (guild) throw guild.language.get('COMMAND_CONF_KEY_NOT_ARRAY');
			throw 'The key is not an array.';
		}
		guild = this.gateway._resolveGuild(guild);

		const parsed = await path.parse(value, guild);
		const parsedID = parsed && parsed.id ? parsed.id : parsed;

		// Handle entry creation if it does not exist.
		if (!this.existsInDB) await this.gateway.createEntry(this.id);
		const oldClone = this.client.listenerCount('configUpdateEntry') ? this.clone() : null;

		let cache = this; // eslint-disable-line consistent-this
		for (let i = 0; i < route.length - 1; i++) cache = cache[route[i]] || {};
		cache = cache[route[route.length - 1]] || [];

		if (action === 'add') {
			if (cache.includes(parsedID)) throw `The value ${parsedID} for the key ${path.path} already exists.`;
			cache.push(parsedID);
		} else {
			const index = cache.indexOf(parsedID);
			if (index === -1) throw `The value ${parsedID} for the key ${path.path} does not exist.`;
			cache.splice(index, 1);
		}

		if (oldClone !== null) this.client.emit('configUpdateEntry', oldClone, this, path.path);
		return { parsed, parsedID, array: cache, path, route };
	}

	/**
	 * Update an array
	 * @since 0.5.0
	 * @param {('add'|'remove')} action Whether the value should be added or removed to the array
	 * @param {string} key The key to edit
	 * @param {*} value The new value
	 * @param {ConfigGuildResolvable} guild The guild to take
	 * @param {boolean} avoidUnconfigurable Whether the Gateway should avoid configuring the selected key
	 * @returns {Promise<ConfigurationUpdateResult>}
	 * @private
	 */
	async _sharedUpdateSingle(action, key, value, guild, avoidUnconfigurable) {
		if (typeof key !== 'string') throw new TypeError(`The argument key must be a string. Received: ${typeof key}`);
		if (typeof guild === 'boolean') {
			avoidUnconfigurable = guild;
			guild = undefined;
		}

		const pathData = this.gateway.getPath(key, { avoidUnconfigurable, piece: true });
		const { parsedID, array, parsed } = pathData.path.array === true ?
			await this._parseUpdateArray(action, key, value, guild, pathData) :
			await this._parseUpdateOne(key, value, guild, pathData);

		if (this.gateway.sql) await this.gateway.provider.update(this.gateway.type, this.id, key, array === null ? parsedID : array);
		else await this.gateway.provider.update(this.gateway.type, this.id, this.toJSON());

		return { value: parsed, path: pathData.path };
	}

	/**
	 * Update many keys in a single query.
	 * @since 0.5.0
	 * @param {Object} cache The key target
	 * @param {Object} object The key to edit
	 * @param {SchemaFolder} schema The new value
	 * @param {ConfigGuildResolvable} guild The guild to take
	 * @param {ConfigurationUpdateManyList} list The options
	 * @private
	 */
	_updateMany(cache, object, schema, guild, list) {
		guild = this.gateway._resolveGuild(guild);
		const keys = Object.keys(object);
		for (let i = 0; i < keys.length; i++) {
			const key = keys[i];
			if (schema.hasKey(key) === false) continue;
			if (schema[key].type === 'Folder') {
				this._updateMany(cache[key], object[key], schema[key], guild, list);
				continue;
			}
			list.promises.push(schema[key].parse(object[key], guild)
				.then(result => {
					const parsedID = result && result.id ? result.id : result;
					cache[key] = parsedID;
					list.keys.push(schema[key].path);
					list.values.push(parsedID);
				})
				.catch(error => list.errors.push([schema[key].path, error])));
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
		if (!this.existsInDB) await this.gateway.createEntry(this.id);
		const oldClone = this.client.listenerCount('configUpdateEntry') ? this.clone() : null;

		let cache = this; // eslint-disable-line consistent-this
		for (let i = 0; i < route.length - 1; i++) cache = cache[route[i]] || {};
		cache[route[route.length - 1]] = parsedID;

		if (oldClone !== null) this.client.emit('configUpdateEntry', oldClone, this, path.path);
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
			if (schema[key].type === 'Folder') Configuration._patch(this[key], data[key], schema[key]);
			else this[key] = data[key];
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
			if (typeof data === 'undefined') data = {};
			for (let i = 0; i < schema.keyArray.length; i++) {
				const key = schema.keyArray[i];
				data[key] = Configuration._merge(data[key], schema[key]);
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
			else clone[key] = schema[key].array ? data[key].slice(0) : data[key];
		}

		return clone;
	}

	/**
	 * Patch an object.
	 * @since 0.5.0
	 * @param {Object} inst The reference of the Configuration instance
	 * @param {Object} data The original object
	 * @param {SchemaFolder} schema A SchemaFolder instance
	 * @private
	 */
	static _patch(inst, data, schema) {
		for (let i = 0; i < schema.keyArray.length; i++) {
			const key = schema.keyArray[i];
			if (typeof data[key] === 'undefined') continue;
			inst[key] = schema[key].type === 'Folder' ?
				Configuration._patch(inst[key], data[key], schema[key]) :
				data[key];
		}
	}

}

module.exports = Configuration;
