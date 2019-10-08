const { isObject, objectToTuples, arraysStrictEquals, toTitleCase, mergeObjects, makeObject, resolveGuild, deepClone } = require('../util/util');
const Type = require('../util/Type');

/**
 * The SettingsFolder class that manages the data for an entry from the database
 * @extends Map
 */
class SettingsFolder extends Map {

	/**
	 * @typedef {Object} SettingsFolderResetOptions
	 * @property {boolean} [throwOnError = false] Whether the update should throw on first failure
	 * @property {Boolean} [onlyConfigurable = false] Whether the update should ignore non-configureable keys
	 */

	/**
	 * @typedef {SettingsFolderResetOptions} SettingsFolderUpdateOptions
	 * @property {GuildResolvable} [guild = null] The guild for context in this update
	 * @property {('add'|'remove'|'auto'|'overwrite')} [arrayAction = 'auto'] The array action to take when updating an array
	 * @property {number} [arrayIndex = null] The array index to insert the new element in
	 */

	/**
	 * @typedef {Object} SettingsFolderUpdateResultEntry
	 * @property {string} key The key that got updated relative from this folder
	 * @property {*} value The new value for said key
	 * @property {SchemaEntry} entry The SchemaEntry that manages the updated key
	 */

	/**
	 * @typedef {Object} SettingsFolderUpdateResult
	 * @property {Error[]} errors The errors thrown, only filled if throwOnError is set to true
	 * @property {SettingsFolderUpdateResultEntry[]} updated The updates entries, empty if all errored or no changes were made
	 */

	/**
	 * @since 0.5.0
	 * @param {SchemaFolder} schema The schema that manages this folder's structure
	 */
	constructor(schema) {
		super();

		/**
		 * The reference to the base Settings instance
		 * @since 0.5.0
		 * @type {?Settings}
		 * @private
		 */
		Object.defineProperty(this, 'base', { value: null, writable: true });

		/**
		 * The schema that manages this folder's structure
		 * @since 0.5.0
		 * @type {Gateway}
		 * @name Settings#schema
		 * @readonly
		 */
		Object.defineProperty(this, 'schema', { value: schema });
	}

	/**
	 * The gateway that manages this instance
	 * @since 0.5.0
	 * @type {Gateway}
	 */
	get gateway() {
		return this.base.gateway;
	}

	/**
	 * Get a value from the configuration. Accepts nested objects separating by dot
	 * @since 0.5.0
	 * @param {string} path The path of the key's value to get from this instance
	 * @returns {*}
	 * @example
	 * // Simple get
	 * const prefix = message.guild.settings.get('prefix');
	 *
	 * // Nested entry
	 * const channel = message.guild.settings.get('channels.moderation-logs');
	 */
	get(path) {
		// Map.prototype.get.call was used to avoid infinite recursion
		return deepClone(path.split('.').reduce((folder, key) => Map.prototype.get.call(folder, key), this));
	}

	/**
	 * Plucks out one or more attributes from either an object or a sequence of objects
	 * @since 0.5.0
	 * @param  {...string} paths The paths to take
	 * @returns {Array<*>}
	 * @example
	 * const [x, y] = message.guild.settings.pluck('x', 'y');
	 * console.log(x, y);
	 */
	pluck(...paths) {
		return paths.map(path => {
			const value = this.get(path);
			return typeof value !== 'undefined' ? value instanceof SettingsFolder ? value.toJSON() : value : undefined;
		});
	}

	/**
	 * Extract the relative path from an absolute one or an entry
	 * @since 0.5.0
	 * @param {string|Schema|SchemaEntry} pathOrPiece The path or entry to substract the path from
	 * @returns {string}
	 */
	relative(pathOrPiece) {
		if (typeof pathOrPiece === 'string') {
			return this.schema.path && pathOrPiece.startsWith(this.schema.path) ? pathOrPiece.slice(this.schema.path + 1) : pathOrPiece;
		}

		return this.relative(pathOrPiece.path);
	}

	/**
 	 * Resolves paths into their full objects or values depending on the current set value
 	 * @since 0.5.0
 	 * @param  {...string} paths The paths to resolve
 	 * @returns {Promise<Array<*>>}
 	 */
	resolve(...paths) {
		const guild = resolveGuild(this.base.gateway.client, this.base.target);
		const language = guild ? guild.language : this.base.gateway.client.languages.default;
		return Promise.all(paths.map(path => {
			const entry = this.schema.get(this.relative(path));
			return entry.resolve(this, language, guild);
		}));
	}

	/**
	 * Reset a value from an entry.
	 * @since 0.5.0
	 * @param {(string|string[])} [keys] The key to reset
	 * @param {SettingsFolderResetOptions} [options={}] The options for the reset
	 * @returns {SettingsFolderUpdateResult}
	 * @example
	 * // Reset all keys for this instance
	 * message.guild.settings.reset();
	 *
	 * // Reset a key
	 * message.guild.settings.reset('prefix');
	 *
	 * // Reset multiple keys for this instance
	 * message.guild.settings.reset(['prefix', 'channels.modlog']);
	 */
	// eslint-disable-next-line complexity
	async reset(paths = [...this.keys()], { throwOnError, onlyConfigurable, guild } = {}) {
		const status = this.base.existenceStatus;
		// If this entry is out of sync, sync it first
		if (status === null) await this.base.sync();
		// If this entry does not exist, it is not possible for it to have an entry reset
		if (status === false) return { errors: [], updated: [] };

		if (typeof paths === 'string') paths = [paths];
		else if (isObject(paths)) paths = objectToTuples(paths).map(tuple => tuple[0]);

		guild = resolveGuild(this.base.gateway.client, typeof guild !== 'undefined' ? guild : this.base.target);
		const language = guild ? guild.language : this.base.gateway.client.languages.default;

		const errors = [];

		// Function first to allow override, then client option
		throwOnError = throwOnError !== undefined ? throwOnError : this.base.gateway.client.options.settings.throwOnError;

		// Resolve schema values
		const values = [];
		const { schema } = this;
		for (const path of paths) {
			try {
				const key = this.relative(path);
				let entry;
				try {
					entry = schema.get(key);
					if (!entry) throw undefined;
				} catch (__) {
					throw language.get('SETTING_GATEWAY_KEY_NOEXT', path);
				}
				if (entry.type === 'Folder') {
					const valuesLength = values.length;
					const prefixLength = this.schema.path ? this.schema.path.length + 1 : 0;
					// Recurse to all sub-pieces
					for (const value of entry.values(true)) {
						if (onlyConfigurable && !value.configurable) continue;
						values.push([value.path.slice(prefixLength), entry]);
					}
					if (values.length === valuesLength) throw language.get('SETTING_GATEWAY_UNCONFIGURABLE_FOLDER');
				} else if (onlyConfigurable && !entry.configurable) {
					throw language.get('SETTING_GATEWAY_UNCONFIGURABLE_FOLDER');
				} else {
					values.push([key, entry]);
				}
			} catch (error) {
				if (throwOnError) throw typeof error === 'string' ? new Error(error) : error;
				errors.push(error);
			}
		}

		// Queue updates
		const results = [];
		for (const [path, entry] of values) {
			if (entry.array ? arraysStrictEquals(this.get(path), entry.default) : this.get(path) === entry.default) continue;
			results.push({ key: path, value: entry.default, entry });
		}

		if (results.length) await this._save(results);
		return { errors, updated: results };
	}

	/**
	 * Update a value from an entry.
	 * @since 0.5.0
	 * @param {(string|Object)} paths The key to modify
	 * @param {*} [value] The value to parse and save
	 * @param {SettingsFolderUpdateOptions} [options={}] The options for the update
	 * @returns {SettingsFolderUpdateResult}
	 * @async
	 * @example
	 * // Updating the value of a key
	 * message.guild.settings.update('roles.administrator', '339943234405007361');
	 *
	 * // Updating an array:
	 * message.guild.settings.update('userBlacklist', '272689325521502208');
	 *
	 * // Ensuring the function call adds (error if it exists):
	 * message.guild.settings.update('userBlacklist', '272689325521502208', { arrayAction: 'add' });
	 *
	 * // Updating it with a json object:
	 * message.guild.settings.update({ roles: { administrator: '339943234405007361' } });
	 *
	 * // Updating multiple keys (with json object):
	 * message.guild.settings.update({ prefix: 'k!', language: 'es-ES' });
	 *
	 * // Updating multiple keys (with arrays):
	 * message.guild.settings.update([['prefix', 'k!'], ['language', 'es-ES']]);
	 */
	// eslint-disable-next-line complexity
	async update(paths, ...args) {
		let options;
		if (typeof paths === 'string') [paths, options] = [[[paths, args[0]]], args[1]];
		else if (isObject(paths)) [paths, options] = [objectToTuples(paths), args[0]];
		else [options] = args;

		if (!options) options = { throwOnError: false, onlyConfigurable: false };
		options.guild = resolveGuild(this.base.gateway.client, 'guild' in options ? options.guild : this.base.target);
		const language = options.guild ? options.guild.language : this.base.gateway.client.languages.default;

		// Function first to allow override, then client option
		options.throwOnError = 'throwOnError' in options ? options.throwOnError : this.base.gateway.client.options.settings.throwOnError;

		const errors = [];

		// Resolve schema values
		const values = [];
		const promises = [];
		const { schema } = this;

		const onError = options.throwOnError ? (error) => { throw error; } : (error) => errors.push(error);
		for (const value of paths) {
			try {
				if (value.length !== 2) throw new TypeError(`Invalid value. Expected object, string or Array<[string, Schema | SchemaEntry | string]>. Got: ${new Type(value)}`);

				const key = this.relative(value[0]);
				let entry;
				try {
					entry = schema.get(key);
					if (!entry) throw undefined;
				} catch (__) {
					throw language.get('SETTING_GATEWAY_KEY_NOEXT', value[0]);
				}
				if (entry.type === 'Folder') {
					const keys = options.onlyConfigurable ? entry.configurableKeys : [...entry.keys()];
					throw keys.length ? language.get('SETTING_GATEWAY_CHOOSE_KEY', keys.join('\', \'')) : language.get('SETTING_GATEWAY_UNCONFIGURABLE_FOLDER');
				}
				if (!entry.array && Array.isArray(value[1])) {
					throw language.get('SETTING_GATEWAY_KEY_NOT_ARRAY', key);
				}

				const previous = this.get(key);
				promises.push(this._parse(entry, previous, value[1], options)
					.then((parsed) => values.push([entry.path, previous, parsed, entry]))
					.catch(onError));
			} catch (error) {
				if (options.throwOnError) throw error;
				errors.push(error);
			}
		}

		// Run all the operations
		if (promises.length) await Promise.all(promises);

		// Queue updates
		const results = [];
		for (const [path, previous, value, entry] of values) {
			if (entry.array ? arraysStrictEquals(value, previous) : value === previous) continue;
			results.push({ key: path, value, entry });
		}

		if (results.length) await this._save(results);
		return { errors, updated: results };
	}

	/**
	 * Get a list.
	 * @since 0.5.0
	 * @param {KlasaMessage} message The Message instance
	 * @param {string|Schema|SchemaEntry} [path] The path to resolve
	 * @returns {string}
	 */
	display(message, path) {
		const entry = path ? typeof path === 'string' ? this.schema.get(this.relative(path)) : path : this.schema;

		if (entry.type !== 'Folder') {
			const value = path ? this.get(this.schema.path ? entry.path.slice(this.schema.path + 1) : entry.path) : this;
			if (value === null) return 'Not set';
			if (entry.array) return value.length ? `[ ${value.map(val => entry.serializer.stringify(val, message)).join(' | ')} ]` : 'None';
			return entry.serializer.stringify(value, message);
		}

		const array = [];
		const folders = [];
		const sections = new Map();
		let longest = 0;
		for (const [key, value] of entry.entries()) {
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
					...sections.get(keyType).sort().map(key => `${key.padEnd(longest)} :: ${this.display(message, entry.get(key))}`),
					'');
			}
		}
		return array.join('\n');
	}

	/**
	 * Save the data to the database and patch the data.
	 * @since 0.5.0
	 * @param {SettingsFolderUpdateResultEntry[]} results The data to save
	 * @private
	 */
	async _save(results) {
		const status = this.base.existenceStatus;
		if (status === null) throw new Error('Cannot update out of sync.');

		const updateObject = {};
		for (const entry of results) mergeObjects(updateObject, makeObject(entry.key, entry.value));

		if (status === false) {
			await this.gateway.provider.create(this.gateway.name, this.base.id, results);
			this.base.existenceStatus = true;
			this.base.gateway.client.emit('settingsCreate', this.base, updateObject);
		} else {
			await this.gateway.provider.update(this.gateway.name, this.id, results);
			this.base.gateway.client.emit('settingsUpdate', this.base, updateObject);
		}

		this._patch(updateObject);
	}

	/**
	 * Parse a value
	 * @since 0.5.0
	 * @param {SchemaEntry} entry The path result
	 * @param {*} previous The key that updates
	 * @param {*} next The value to parse
	 * @param {SettingsFolderUpdateOptions} options The parse options
	 * @private
	 */
	async _parse(entry, previous, next, options) {
		if (next === null) return entry.default;

		const isArray = Array.isArray(next);
		if (isArray) next = await Promise.all(next.map(async val => entry.serializer.serialize(await entry.parse(val, options.guild))));
		else next = entry.serializer.serialize(await entry.parse(next, options.guild));

		if (!entry.array) return next;
		if (!isArray) next = [next];

		const { arrayAction = 'auto', arrayIndex = null } = options;
		if (arrayAction === 'overwrite') return next;

		const clone = previous.slice();
		if (arrayIndex !== null) {
			if (arrayIndex < 0 || arrayIndex > previous.length + 1) {
				throw `The index ${arrayIndex} is bigger than the current array. It must be a value in the range of 0..${previous.length + 1}.`;
			}
			[clone[arrayIndex]] = next;
		} else if (arrayAction === 'auto') {
			// Array action auto must add or remove values, depending on their existence
			for (const val of next) {
				const index = clone.indexOf(val);
				if (index === -1) clone.push(val);
				else clone.splice(index, 1);
			}
		} else if (arrayAction === 'add') {
			// Array action add must add values, throw on existent
			for (const val of next) {
				if (clone.includes(val)) throw `The value ${val} for the key ${entry.path} already exists.`;
				clone.push(val);
			}
		} else if (arrayAction === 'remove') {
			// Array action remove must add values, throw on non-existent
			for (const val of next) {
				const index = clone.indexOf(val);
				if (index === -1) throw `The value ${val} for the key ${entry.path} does not exist.`;
				clone.splice(index, 1);
			}
		} else {
			throw `The ${arrayAction} array action is not a valid SettingsUpdateArrayAction.`;
		}

		return clone;
	}

	/**
	 * Path this Settings instance.
	 * @since 0.5.0
	 * @param {Object} data The data to patch
	 * @private
	 */
	_patch(data) {
		if (!isObject(data)) return;
		for (const [key, value] of Object.entries(data)) {
			// Undefined values are invalid values, skip
			if (typeof value === 'undefined') continue;
			const subkey = super.get(key);

			// If the key doesn't exist, it's not in this schema, skip
			if (typeof subkey === 'undefined') continue;

			// Patch recursively if the key is a folder, set otherwise
			if (subkey instanceof SettingsFolder) subkey._patch(value);
			else super.set(key, value);
		}
	}

	/**
	 * The serializable plain JSON object for this instance
	 * @since 0.0.1
	 * @returns {Object}
	 * @example
	 * console.log(this.client.settings);
	 * // Settings [Map] {
	 * //   'userBlacklist' => [],
	 * //   'guildBlacklist' => [],
	 * //   'schedules' => [Array] }
	 *
	 * console.log(this.client.settings.toJSON());
	 * // { userBlacklist: [],
	 * //   guildBlacklist: [],
	 * //   schedules: [Array] }
	 */
	toJSON() {
		const object = {};

		for (const [key, value] of this.entries()) object[key] = value instanceof SettingsFolder ? value.toJSON() : value;

		return object;
	}

	/**
	 * Defines the toString behavior of this object
	 * @returns {string}
	 */
	toString() {
		return `Settings[${this.gateway.name}:${this.base.id}]`;
	}

	/**
	 * Init all the maps
	 * @param {SettingsFolder} folder The folder to initialize
	 * @param {SchemaFolder} schema The schema to guide the initialization
	 * @private
	 */
	init(folder, schema) {
		folder.base = this;
		for (const [key, value] of schema.entries()) {
			if (value.type === 'Folder') {
				const settings = new SettingsFolder(value);
				folder.set(key, settings);
				this.init(settings, value);
			} else {
				folder.set(key, value.default);
			}
		}
	}

}

module.exports = SettingsFolder;
