const { isFunction } = require('../../util/util');
const SettingsFolder = require('../SettingsFolder');

/**
 * The base Schema for {@link Gateway}s
 * @extends Map
 * @since 0.5.0
 */
class Schema extends Map {

	/**
	 * @param {string} [basePath=''] The base schema path
	 */
	constructor(basePath = '') {
		super();

		/**
		 * Returns the path for this schema
		 * @since 0.5.0
		 * @name Schema#path
		 * @type {string}
		 * @readonly
		 */
		Object.defineProperty(this, 'path', { value: basePath });

		/**
		 * The type of this SchemaFolder (always 'Folder')
		 * @since 0.5.0
		 * @name Schema#type
		 * @type {string}
		 * @readonly
		 */
		Object.defineProperty(this, 'type', { value: 'Folder' });

		/**
		 * The defaults for the current SchemaFolder or Schema instance
		 * @since 0.5.0
		 * @name Schema#defaults
		 * @type {SettingsFolder}
		 * @readonly
		 */
		Object.defineProperty(this, 'defaults', { value: new SettingsFolder(this) });
	}

	set(key, value) {
		this.defaults.set(key, value instanceof Schema ? value.defaults : value.default);
		return super.set(key, value);
	}

	delete(key) {
		this.defaults.delete(key);
		return super.delete(key);
	}

	/**
	 * Get the configurable keys for the current SchemaFolder or Schema instance
	 * @since 0.5.0
	 * @type {Array<string>}
	 * @readonly
	 */
	get configurableKeys() {
		const keys = [];
		for (const entry of this.values(true)) if (entry.configurable) keys.push(entry.path);
		return keys;
	}

	/**
	 * Get the configurable value for the current SchemaFolder or Schema instance
	 * @since 0.5.0
	 * @type {Array<SchemaEntry>}
	 * @readonly
	 */
	get configurableValues() {
		const values = [];
		for (const entry of this.values(true)) if (entry.configurable) values.push(entry);
		return values;
	}

	/**
	 * Get the paths for the current SchemaFolder or Schema instance
	 * @since 0.5.0
	 * @type {Map<string, SchemaFolder|SchemaEntry>}
	 * @readonly
	 */
	get paths() {
		const paths = new Map();
		for (const entry of this.values(true)) paths.set(entry.path, entry);
		return paths;
	}

	/**
	 * Adds a Folder or Piece instance to the current SchemaFolder or Schema instance
	 * @since 0.5.0
	 * @param {string} key The name of the entry you are trying to add.
	 * @param {string|Function} typeOrCallback A function to add a folder or a string to add a new SchemaEntry
	 * @param {SchemaEntryOptions} [options] An object of options used for schema entries
	 * @returns {this}
	 * @chainable
	 * @example
	 * // callback is always passed the created folder to encourage chaining
	 * Schema.add('folder', (folder) => folder.add('name', 'textchannel'));
	 * // or
	 * Schema.add('name', 'string', { default: 'klasa!' });
	 */
	add(key, typeOrCallback, options = {}) {
		if (!typeOrCallback) throw new Error(`The type for ${key} must be a string for pieces, and a callback for folders`);

		let SchemaCtor;
		let type;
		let callback;
		if (isFunction(typeOrCallback)) {
			// .add('folder', (folder) => ());
			callback = typeOrCallback;
			type = 'Folder';
			SchemaCtor = require('./SchemaFolder');
		} else if (typeof typeOrCallback === 'string') {
			// .add('name', 'string', { optional options });
			SchemaCtor = require('./SchemaEntry');
			type = typeOrCallback;
			callback = null;
		}

		// Get previous key and merge the new with the pre-existent if it exists
		const previous = super.get(key);
		if (previous) {
			if (type === 'Folder') {
				// If the type of the new entry is a Folder, the previous must also be a Folder.
				if (previous.type !== 'Folder') throw new Error(`The type for ${key} conflicts with the previous value, expected type Folder, got ${previous.type}.`);
				// Call the callback with the pre-existent Folder
				callback(previous); // eslint-disable-line callback-return
				return this;
			}
			// If the type of the new entry is not a Folder, the previous must also not be a Folder.
			if (previous.type === 'Folder') throw new Error(`The type for ${key} conflicts with the previous value, expected a non-Folder, got ${previous.type}.`);
			// Edit the previous key
			previous.edit({ type, ...options });
			return this;
		}
		const entry = new SchemaCtor(this, key, type, options);

		// eslint-disable-next-line callback-return
		if (callback) callback(entry);

		this.set(key, entry);

		return this;
	}

	/**
	 * Get a SchemaEntry or a SchemaFolder given a path
	 * @since 0.5.0
	 * @param {string} path The key to get from the schema
	 * @returns {?SchemaEntry|SchemaFolder}
	 */
	get(path) {
		// Map.prototype.get.call was used to avoid infinite recursion
		return path.split('.').reduce((folder, key) => Map.prototype.get.call(folder, key), this);
	}


	/**
	 * Resolves this schema into it's deserialized objects.
	 * @since 0.5.0
	 * @param {Settings} settings The settings object we're resolving for
	 * @param {Language} language The language to use for this resolve operation
	 * @param {Guild} guild The guild to use for this resolve operation
	 * @returns {*}
	 */
	async resolve(settings, language, guild) {
		const promises = [];
		for (const entry of this.values(true)) promises.push(entry.resolve(settings, language, guild).then(parsed => ({ [entry.key]: parsed })));
		return Object.assign({}, ...await Promise.all(promises));
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
			for (const [key, value] of super.entries()) {
				if (value.type === 'Folder') yield* value.keys(recursive);
				else yield key;
			}
		} else {
			yield* super.keys();
		}
	}

	/**
	 * Returns a new Iterator object that contains the values for each element contained in this folder.
	 * Identical to [Map.values()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/values)
	 * @since 0.5.0
	 * @param {boolean} recursive Whether the iteration should be recursive
	 * @yields {(SchemaFolder|SchemaEntry)}
	 */
	*values(recursive = false) {
		if (recursive) {
			for (const value of super.values()) {
				if (value.type === 'Folder') yield* value.values(recursive);
				else yield value;
			}
		} else {
			yield* super.values();
		}
	}

	/**
	 * Returns a new Iterator object that contains the `[key, value]` pairs for each element contained in this folder.
	 * Identical to [Map.entries()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/entries)
	 * @since 0.5.0
	 * @param {boolean} recursive Whether the iteration should be recursive
	 * @yields {Array<string|SchemaFolder|SchemaEntry>}
	 */
	*entries(recursive = false) {
		if (recursive) {
			for (const [key, value] of super.entries()) {
				if (value.type === 'Folder') yield* value.entries(recursive);
				else yield [key, value];
			}
		} else {
			yield* super.entries();
		}
	}

	/**
	 * Get a JSON object containing data from this SchemaFolder
	 * @since 0.5.0
	 * @returns {Object}
	 */
	toJSON() {
		return Object.assign({}, ...[...this.values()].map(entry => ({ [entry.key]: entry.toJSON() })));
	}

}

module.exports = Schema;
