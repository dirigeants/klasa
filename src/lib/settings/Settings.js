const { isObject, deepClone, toTitleCase, arraysStrictEquals, objectToTuples, resolveGuild, mergeDefault } = require('../util/util');
const Type = require('../util/Type');
const SchemaPiece = require('./schema/SchemaPiece');
const Schema = require('./schema/Schema');
const { DEFAULTS: { SETTINGS } } = require('../util/constants');

/**
 * <warning>Creating your own Settings instances is often discouraged and unneeded. SettingsGateway handles them internally for you.</warning>
 * The Settings class that stores the cache for each entry in SettingsGateway.
 */
class Settings {

	/**
	 * @typedef {Object} SettingsJSON
	 */

	/**
	 * @typedef {Object} SettingsUpdateResult
	 * @property {Error[]} errors The errors caught from parsing
	 * @property {SettingsUpdateResultEntry[]} updated The updated keys
	 */

	/**
	 * @typedef {Object} SettingsUpdateResultEntry
	 * @property {any[]} data A tuple containing the path of the updated key and the new value
	 * @property {SchemaPiece} piece The SchemaPiece instance that manages the updated key
	 */

	/**
	 * @typedef {Object} SettingsUpdateOptions
	 * @property {('add'|'remove'|'auto'|'overwrite')} [action='auto'] Whether the update (when using arrays) should add or remove,
	 * leave it as 'auto' to add or remove depending on the existence of the key in the array
	 * @property {number} [arrayPosition=null] The position of the array to replace
	 * @property {boolean} [avoidUnconfigurable=false] Whether the update should avoid unconfigurable keys
	 * @property {boolean} [force=false] Whether this should skip the equality checks or not
	 * @property {GuildResolvable} [guild=null] A KlasaGuild resolvable for multilingual support
	 * @property {boolean} [rejectOnError=false] Whether this call should reject on error
	 */

	/**
	 * @typedef {Object} SettingsResetOptions
	 * @property {boolean} [avoidUnconfigurable=false] Whether the update should avoid unconfigurable keys
	 * @property {boolean} [force=false] Whether this should skip the equality checks or not
	 * @property {boolean} [rejectOnError=false] Whether this call should reject on error
	 */

	/**
	 * @since 0.5.0
	 * @param {Gateway} manager The Gateway that manages this Settings instance
	 * @param {Object} data The data that is cached in this Settings instance
	 */
	constructor(manager, data) {
		/**
		 * The client this Settings was created with.
		 * @since 0.5.0
		 * @type {KlasaClient}
		 * @name Settings#client
		 * @readonly
		 */
		Object.defineProperty(this, 'client', { value: manager.client });

		/**
		 * The Gateway that manages this Settings instance.
		 * @since 0.5.0
		 * @type {Gateway}
		 * @name Settings#gateway
		 * @readonly
		 */
		Object.defineProperty(this, 'gateway', { value: manager });

		/**
		 * The ID that identifies this instance.
		 * @since 0.5.0
		 * @type {string}
		 * @name Settings#id
		 * @readonly
		 */
		Object.defineProperty(this, 'id', { value: data.id });

		/**
		 * Whether this entry exists in the DB or not.
		 * @since 0.5.0
		 * @type {?boolean}
		 * @name Settings#_existsInDB
		 * @private
		 */
		Object.defineProperty(this, '_existsInDB', { value: null, writable: true });

		const { defaults, schema } = this.gateway;
		for (const key of schema.keys()) this[key] = defaults[key];
		this._patch(data);
	}

	/**
	 * Check whether this Settings is being synchronized in the Gateway's sync queue.
	 * @since 0.5.0
	 * @type {boolean}
	 */
	get synchronizing() {
		return this.gateway.syncQueue.has(this.id);
	}

	/**
	 * Get a value from the configuration. Accepts nested objects separating by dot.
	 * @since 0.5.0
	 * @param {string|string[]} path The path of the key's value to get from this instance
	 * @returns {*}
	 */
	get(path) {
		try {
			const piece = this._resolvePath(path, false, true);

			let value = this; // eslint-disable-line consistent-this
			for (const key of piece.path.split('.')) value = value[key];

			return value;
		} catch (__) {
			return undefined;
		}
	}

	/**
	 * Clone this instance.
	 * @since 0.5.0
	 * @returns {Settings}
	 */
	clone() {
		return new this.constructor(this.gateway, this);
	}

	/**
	 * Sync the data from the database with the cache.
	 * @since 0.5.0
	 * @param {boolean} [force=false] Whether the sync should download from the database
	 * @returns {Promise<this>}
	 */
	sync(force = this._existsInDB === null) {
		// Await current sync status from the sync queue
		const syncStatus = this.gateway.syncQueue.get(this.id);
		if (!force || syncStatus) return syncStatus || Promise.resolve(this);

		// If it's not currently synchronizing, create a new sync status for the sync queue
		const sync = this.gateway.provider.get(this.gateway.type, this.id).then(data => {
			this._existsInDB = Boolean(data);
			if (data) this._patch(data);
			this.gateway.syncQueue.delete(this.id);
			return this;
		});

		this.gateway.syncQueue.set(this.id, sync);
		return sync;
	}

	/**
	 * Delete this entry from the database and cache.
	 * @since 0.5.0
	 * @returns {this}
	 */
	async destroy() {
		await this.sync();
		if (this._existsInDB) {
			await this.gateway.provider.delete(this.gateway.type, this.id);
			this.client.emit('settingsDeleteEntry', this);
		}
		return this;
	}

	/**
	 * Reset a value from an entry.
	 * @since 0.5.0
	 * @param {(string|string[])} [keys] The key to reset
	 * @param {SettingsResetOptions} [options={}] The options for the reset
	 * @returns {SettingsUpdateResult}
	 * @example
	 * // Reset all keys for this instance
	 * Settings#reset();
	 *
	 * // Reset multiple keys for this instance
	 * Settings#reset(['prefix', 'channels.modlog']);
	 *
	 * // Reset a key
	 * Settings#reset('prefix');
	 */
	async reset(keys = [...this.gateway.schema.values(true)], ...args) {
		const { parsedEntries, options: { avoidUnconfigurable = false, force = false, rejectOnError = false } } = this._resolveUpdateOverloads(true, keys, ...args);
		await this.sync();

		// If the entry does not exist in the DB, it'll never be able to reset a key
		if (!this._existsInDB) return { errors: [], updated: [] };

		const result = { errors: [], updated: [] };
		const handleError = rejectOnError ? (error) => { throw error; } : result.errors.push.bind(result.errors);

		// Resolve all keys into SchemaPieces, including parsing SchemaFolders into all its children
		const resolvedKeys = [];
		for (const key of parsedEntries) {
			try {
				const piece = this._resolvePath(key, avoidUnconfigurable, true);
				if (piece.type === 'Folder') resolvedKeys.push(...avoidUnconfigurable ? piece.configurableValues : piece.values(true));
				else resolvedKeys.push(piece);
			} catch (error) {
				handleError(error);
			}
		}
		for (const schemaPiece of resolvedKeys) {
			const value = deepClone(schemaPiece.default);
			if (this._setValueByPath(schemaPiece, value, force).updated) result.updated.push({ data: [schemaPiece.path, value], piece: schemaPiece });
		}
		await this._save(result);
		return result;
	}

	/**
	 * Update a value from an entry.
	 * @since 0.5.0
	 * @param {(string|Object)} key The key to modify
	 * @param {*} [value] The value to parse and save
	 * @param {SettingsUpdateOptions} [options={}] The options for the update
	 * @returns {SettingsUpdateResult}
	 * @async
	 * @example
	 * // Updating the value of a key
	 * Settings#update('roles.administrator', '339943234405007361', { guild: message.guild });
	 *
	 * // Updating an array:
	 * Settings#update('userBlacklist', '272689325521502208');
	 *
	 * // Ensuring the function call adds (error if it exists):
	 * Settings#update('userBlacklist', '272689325521502208', { action: 'add' });
	 *
	 * // Updating it with a json object:
	 * Settings#update({ roles: { administrator: '339943234405007361' } }, { guild: message.guild });
	 *
	 * // Updating multiple keys (with json object):
	 * Settings#update({ prefix: 'k!', language: 'es-ES' }, { guild: message.guild });
	 *
	 * // Updating multiple keys (with arrays):
	 * Settings#update([['prefix', 'k!'], ['language', 'es-ES']]);
	 */
	async update(...args) {
		const { parsedEntries, options } = this._resolveUpdateOverloads(false, ...args);

		if (parsedEntries.some(entry => !Array.isArray(entry) || entry.length !== 2)) {
			throw new TypeError(`Invalid value. Expected object, string or Array<[string, Schema | SchemaPiece | string]>. Got: ${new Type(parsedEntries)}`);
		}

		await this.sync();
		const result = { errors: [], updated: [] };
		const handleError = options.rejectOnError ? (error) => { throw error; } : result.errors.push.bind(result.errors);
		const entries = [];
		for (const [entryKey, entryValue] of parsedEntries) {
			try {
				const schemaPiece = this._resolvePath(entryKey, options.avoidUnconfigurable, false);

				if (!schemaPiece.array && Array.isArray(entryValue)) {
					throw options.guild ?
						options.guild.language.get('SETTING_GATEWAY_KEY_NOT_ARRAY', entryKey) :
						`The path ${entryKey} does not store multiple values.`;
				}

				entries.push([schemaPiece, entryValue]);
			} catch (error) {
				handleError(error);
			}
		}

		if (entries.length) {
			await Promise.all(entries.map(([key, value]) => this._parse(key, value, options, result)));
			await this._save(result);
		}

		return result;
	}

	/**
	 * Get a list.
	 * @since 0.5.0
	 * @param {KlasaMessage} message The Message instance
	 * @param {(Schema|string)} path The path to resolve
	 * @returns {string}
	 */
	display(message, path) {
		const piece = this._resolvePath(path, true, true);
		if (piece.type !== 'Folder') {
			const value = this.get(piece.path);
			if (value === null) return 'Not set';
			if (piece.array) return value.length ? `[ ${value.map(val => piece.serializer.stringify(val, message)).join(' | ')} ]` : 'None';
			return piece.serializer.stringify(value, message);
		}

		const array = [];
		const folders = [];
		const sections = new Map();
		let longest = 0;
		for (const [key, value] of piece.entries()) {
			if (value.type === 'Folder') {
				if (value.configurableKeys.length) folders.push(`// ${key}`);
			} else if (value.configurable) {
				if (key.length > longest) longest = key.length;
				const values = sections.get(value.type) || [];
				if (!values.length) sections.set(value.type, values);
				values.push(key);
			}
		}
		if (folders.length) array.push('= Folders =', ...folders.sort(), '');
		if (sections.size) {
			for (const keyType of [...sections.keys()].sort()) {
				array.push(`= ${toTitleCase(keyType)}s =`,
					...sections.get(keyType).sort().map(key => `${key.padEnd(longest)} :: ${this.display(message, piece.get(key))}`),
					'');
			}
		}
		return array.join('\n');
	}

	/**
	 * Resolve a string or Schema.
	 * @since 0.5.0
	 * @param {string|Schema|SchemaPiece} key The path to resolve
	 * @param {boolean} avoidUnconfigurable Whether this should avoid unconfigurable keys
	 * @param {boolean} acceptFolders Whether this should accept folders
	 * @returns {Schema|SchemaPiece}
	 */
	_resolvePath(key, avoidUnconfigurable, acceptFolders) {
		if (!key || key === '.') return this.gateway.schema;
		if (key instanceof Schema || key instanceof SchemaPiece) {
			// The piece is a Folder
			if (key.type === 'Folder') {
				if (acceptFolders) return key;

				// Does not accept a folder, throw
				const keys = avoidUnconfigurable ? key.configurableKeys : [...key.keys()];
				throw keys.length ? `Please, choose one of the following keys: '${keys.join('\', \'')}'` : 'This group is not configurable.';
			}

			if (avoidUnconfigurable && !key.configurable) throw `The key ${key.path} is not configurable.`;
			return key;
		}

		const piece = this.gateway.schema.get(key);
		if (piece) return this._resolvePath(piece, avoidUnconfigurable, acceptFolders);

		// The piece does not exist (invalid or non-existent path)
		throw `The key ${key} does not exist in the schema.`;
	}

	/**
	 * Resolves the update overloads
	 * @param {boolean} isReset Whether or not this is resolving the overloads for reset
	 * @param {string|Schema|SchemaPiece|Iterable<string|Schema|SchemaPiece>|Object<string,*>} key The key/s to resolve
	 * @param {*} [value] The values to parse
	 * @param {SettingsUpdateOptions|SettingsResetOptions} [options] The options to parse
	 * @returns {Array<string|Schema|SchemaPiece>|Array<Array<*>>}
	 */
	// eslint-disable-next-line complexity
	_resolveUpdateOverloads(isReset, key, value, options) {
		if (!key) throw new TypeError(`Expected a key value. Got: ${new Type(key)}`);

		// Reset only takes 2 arguments
		if (isReset) value = options;

		// Resolve iterators into an array
		if (typeof key === 'object' && !Array.isArray(key)) {
			if (isReset && typeof key.keys === 'function') key = [...key.keys()];
			else if (!isReset && Symbol.iterator in key) key = [...key];
		}

		let parsedEntries;
		// Overload update(object, GuildResolvable);
		if (isObject(key)) {
			parsedEntries = objectToTuples(key);
			if (isReset) parsedEntries = parsedEntries.map(tuple => tuple[0]);
		} else if (typeof key === 'string') {
			// Overload update(string, any, ...any[]);
			// Overload reset(string, options);
			parsedEntries = isReset ? [key] : [[key, value]];
			if (!isReset) value = options;
		} else if (Array.isArray(key)) {
			// Overload update(Array<any>);
			// Overload reset(Array<string>);
			parsedEntries = key;
			if (!isReset) value = options;
		} else {
			throw new TypeError(`Invalid value. Expected object, string or Array<any>. Got: ${new Type(key)}`);
		}

		if (typeof options === 'undefined') options = { guild: this.gateway.type === 'guilds' ? this.client.guilds.get(this.id) : null };
		else if (!isObject(options)) throw new TypeError(`Invalid options. Expected object or undefined. Got: ${new Type(options)}`);
		else if (options.guild) options.guild = resolveGuild(this.client, options.guild);

		options = mergeDefault(isReset ? SETTINGS.reset : SETTINGS.update, options);

		return { parsedEntries, options };
	}

	/**
	 * Parse a value
	 * @since 0.5.0
	 * @param {SchemaPiece} piece The path result
	 * @param {*} value The value to parse
	 * @param {SettingsUpdateOptions} options The parse options
	 * @param {SettingsUpdateResult} result The updated result
	 * @private
	 */
	async _parse(piece, value, options, result) {
		const parsed = value === null ?
			deepClone(piece.default) :
			await (Array.isArray(value) ?
				this._parseAll(piece, value, options.guild, result.errors) :
				piece.parse(value, options.guild).catch((error) => { result.errors.push(error); }));
		if (typeof parsed === 'undefined') return;
		const parsedID = Array.isArray(parsed) ? parsed.map(val => piece.serializer.serialize(val)) : piece.serializer.serialize(parsed);
		if (piece.array) {
			this._parseArray(piece, parsedID, options, result);
		} else if (this._setValueByPath(piece, parsedID, options.force).updated) {
			result.updated.push({ data: [piece.path, parsedID], piece });
		}
	}

	/**
	 * Save the data to the database.
	 * @since 0.5.0
	 * @param {SettingsUpdateResult} result The data to save
	 * @private
	 */
	async _save({ updated }) {
		if (!updated.length) return;
		if (this._existsInDB === false) {
			await this.gateway.provider.create(this.gateway.type, this.id);
			this._existsInDB = true;
			this.client.emit('settingsCreateEntry', this);
		}

		await this.gateway.provider.update(this.gateway.type, this.id, updated);
		this.client.emit('settingsUpdateEntry', this, updated);
	}

	/**
	 * Parse a single value for an array
	 * @since 0.5.0
	 * @param {SchemaPiece} piece The SchemaPiece pointer that parses this entry
	 * @param {*} parsed The parsed value
	 * @param {SettingsUpdateOptions} options The parse options
	 * @param {SettingsUpdateResult} result The updated result
	 * @private
	 */
	_parseArray(piece, parsed, { force, action, arrayPosition }, { updated, errors }) {
		if (action === 'overwrite') {
			if (!Array.isArray(parsed)) parsed = [parsed];
			if (this._setValueByPath(piece, parsed, force).updated) {
				updated.push({ data: [piece.path, parsed], piece });
			}
			return;
		}

		const array = this.get(piece.path);
		if (typeof arrayPosition === 'number') {
			if (arrayPosition >= array.length) errors.push(new Error(`The option arrayPosition should be a number between 0 and ${array.length - 1}`));
			else array[arrayPosition] = parsed;
		} else {
			for (const value of Array.isArray(parsed) ? parsed : [parsed]) {
				const index = array.indexOf(value);
				if (action === 'auto') {
					if (index === -1) array.push(value);
					else array.splice(index, 1);
				} else if (action === 'add') {
					if (index !== -1) errors.push(new Error(`The value ${value} for the key ${piece.path} already exists.`));
					else array.push(value);
				} else if (index === -1) {
					errors.push(new Error(`The value ${value} for the key ${piece.path} does not exist.`));
				} else {
					array.splice(index, 1);
				}
			}
		}

		updated.push({ data: [piece.path, array], piece });
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
	 * @param {boolean} force Whether this should skip the equality checks or not
	 * @returns {{ updated: boolean, old: any }}
	 * @private
	 */
	_setValueByPath(piece, parsedID, force) {
		const path = piece.path.split('.');
		const lastKey = path.pop();
		let cache = this; // eslint-disable-line consistent-this
		for (const key of path) cache = cache[key] || {};
		const old = cache[lastKey];

		// If both parts are equal, don't update
		if (!force && (piece.array ? arraysStrictEquals(old, parsedID) : old === parsedID)) return { updated: false, old };

		cache[lastKey] = parsedID;
		return { updated: true, old };
	}

	/**
	 * Path this Settings instance.
	 * @since 0.5.0
	 * @param {Object} data The data to patch
	 * @param {Object} [instance=this] The reference of this instance for recursion
	 * @param {Schema} [schema=this.gateway.schema] The Schema that sets the schema for this configuration's gateway
	 * @private
	 */
	_patch(data, instance = this, schema = this.gateway.schema) {
		if (typeof data !== 'object' || data === null) return;
		for (const [key, piece] of schema.entries()) {
			const value = data[key];
			if (value === undefined) continue;
			if (value === null) instance[key] = deepClone(piece.defaults);
			else if (piece.type === 'Folder') this._patch(value, instance[key], piece);
			else instance[key] = value;
		}
	}

	/**
	 * Returns the JSON-compatible object of this instance.
	 * @since 0.5.0
	 * @returns {SettingsJSON}
	 */
	toJSON() {
		return Object.assign({}, ...[...this.gateway.schema.keys()].map(key => ({ [key]: deepClone(this[key]) })));
	}

	/**
	 * Returns a better string when an instance of this class gets stringified.
	 * @since 0.5.0
	 * @returns {string}
	 */
	toString() {
		return `Settings(${this.gateway.type}:${this.id})`;
	}

}

module.exports = Settings;
