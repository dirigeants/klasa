const { isFunction, isNumber } = require('../../util/util');

class SchemaEntry {

	/**
	 * @typedef {Object} SchemaEntryOptions
	 * @property {*} [default] The default value for the key
	 * @property {Function} [filter] The filter to use when resolving this key. The function is passed the resolved value from the resolver, and a guild.
	 * @property {boolean} [array] Whether the key should be stored as Array or not
	 * @property {boolean} [configurable] Whether the key should be configurable by the configuration command or not
	 * @property {number} [min] The minimum value for this entry
	 * @property {number} [max] The maximum value for this entry
	 * @property {boolean} [inclusive] Whether the key should check for inclusivity when checking min and max
	 * @property {boolean} [resolve] Whether or not SG should resolve this value during resolve operations
	 */

	/**
	 * @typedef {SchemaEntryOptions} SchemaEntryEditOptions
	 * @property {string} [type] The new type for this SchemaEntry
	 */

	/**
	 * Creates our SchemaEntry instance
	 * @param {SchemaFolder|Schema} parent The parent folder or schema for this entry instance
	 * @param {string} key The name of this entry instance
	 * @param {string} type The type for this entry instance
	 * @param {SchemaEntryOptions} [options={}] The options for this SchemaEntry instance
	 * @since 0.5.0
	 */
	constructor(parent, key, type, options = {}) {
		/**
		 * The KlasaClient for this SchemaEntry
		 * @name SchemaEntry#client
		 * @since 0.5.0
		 * @type {KlasaClient}
		 * @readonly
		 */
		Object.defineProperty(this, 'client', { value: null, writable: true });

		/**
		 * The parent of this SchemaEntry, either a SchemaFolder instance or Schema instance
		 * @name SchemaEntry#parent
		 * @since 0.5.0
		 * @type {SchemaFolder|Schema}
		 * @readonly
		 */
		Object.defineProperty(this, 'parent', { value: parent });

		/**
		 * The name of this SchemaEntry instance
		 * @name SchemaEntry#key
		 * @since 0.5.0
		 * @type {string}
		 * @readonly
		 */
		Object.defineProperty(this, 'key', { value: key });

		/**
		 * The path of this SchemaEntry instance
		 * @name SchemaEntry#path
		 * @since 0.5.0
		 * @type {string}
		 * @readonly
		 */
		Object.defineProperty(this, 'path', { value: `${this.parent.path ? `${this.parent.path}.` : ''}${this.key}` });

		/**
		 * The type this SchemaEntry instance is for
		 * @since 0.5.0
		 * @type {string}
		 */
		this.type = type.toLowerCase();

		/**
		 * Whether or not this key should hold an array of data, or a single entry of data
		 * @since 0.5.0
		 * @type {boolean}
		 */
		this.array = 'array' in options ? options.array : Array.isArray(options.default);

		/**
		 * The default data this key will revert back to if reset, or if the key is never set
		 * @since 0.5.0
		 * @type {*}
		 */
		this.default = 'default' in options ? options.default : this._generateDefault();

		/**
		 * The minimum value for this key.
		 * @since 0.5.0
		 * @type {?number}
		 */
		this.min = 'min' in options ? options.min : null;

		/**
		 * The maximum value for this key.
		 * @since 0.5.0
		 * @type {?number}
		 */
		this.max = 'max' in options ? options.max : null;

		/**
		 * Whether this key should inclusively or exclusively check min and max
		 * @since 0.5.0
		 * @type {boolean}
		 */
		this.inclusive = 'inclusive' in options ? options.inclusive : true;

		/**
		 * Whether this key should be configurable by the config command. When type is any, this key defaults to false.
		 * @since 0.5.0
		 * @type {boolean}
		 */
		this.configurable = 'configurable' in options ? options.configurable : this.type !== 'any';

		/**
		 * The filter to use for this key when resolving.
		 * @since 0.5.0
		 * @type {Function}
		 */
		this.filter = 'filter' in options ? options.filter : null;

		/**
		 * Whether or not this value should be resolved when resolving values.
		 * @since 0.5.0
		 * @type {boolean}
		 */
		this.shouldResolve = 'resolve' in options ? options.resolve : true;
	}

	/**
	 * The serializer for this SchemaEntry
	 * @since 0.5.0
	 * @type {Serializer}
	 * @readonly
	 */
	get serializer() {
		return this.client.serializers.get(this.type);
	}

	/**
	 * Edit this SchemaEntry's properties
	 * @since 0.5.0
	 * @param {SchemaEntryEditOptions} [options={}] The options for this SchemaEntry
	 * @returns {this}
	 */
	edit(options = {}) {
		if ('type' in options) this.type = options.type;
		if ('array' in options) this.array = options.array;
		if ('configurable' in options) this.configurable = options.configurable;
		if ('filter' in options) this.filter = options.filter;
		if ('default' in options) this.default = options.default;
		if (('min' in options) || ('max' in options)) {
			const { min = null, max = null } = options;
			this.min = min;
			this.max = max;
		}

		return this;
	}

	/**
	 * Checks whether or not this SchemaEntry is valid.
	 * @since 0.5.0
	 * @returns {boolean}
	 */
	isValid() {
		// Check type
		if (typeof this.type !== 'string') throw new TypeError(`[KEY] ${this.path} - Parameter type must be a string.`);
		if (!this.client.serializers.has(this.type)) throw new TypeError(`[KEY] ${this.path} - ${this.type} is not a valid type.`);

		// Check array
		if (typeof this.array !== 'boolean') throw new TypeError(`[KEY] ${this.path} - Parameter array must be a boolean.`);

		// Check configurable
		if (typeof this.configurable !== 'boolean') throw new TypeError(`[KEY] ${this.path} - Parameter configurable must be a boolean.`);

		// Check limits
		if (this.min !== null && !isNumber(this.min)) throw new TypeError(`[KEY] ${this.path} - Parameter min must be a number or null.`);
		if (this.max !== null && !isNumber(this.max)) throw new TypeError(`[KEY] ${this.path} - Parameter max must be a number or null.`);
		if (this.min !== null && this.max !== null && this.min > this.max) throw new TypeError(`[KEY] ${this.path} - Parameter min must contain a value lower than the parameter max.`);

		// Check filter
		if (this.filter !== null && !isFunction(this.filter)) throw new TypeError(`[KEY] ${this.path} - Parameter filter must be a function`);

		// Check default
		if (this.array) {
			if (!Array.isArray(this.default)) throw new TypeError(`[DEFAULT] ${this.path} - Default key must be an array if the key stores an array.`);
		} else if (this.default !== null) {
			if (['boolean', 'string'].includes(this.type) && typeof this.default !== this.type) throw new TypeError(`[DEFAULT] ${this.path} - Default key must be a ${this.type}.`);
		}

		return true;
	}

	/**
	 * Resolves this schemapice into it's deserialized object(s).
	 * @param {Settings} settings The settings object we're resolving for
	 * @param {Language} language The language to use for this resolve operation
	 * @param {Guild} guild The guild to use for this resolve operation
	 * @returns {*}
	 */
	async resolve(settings, language, guild) {
		const value = settings.get(this.path);
		if (!this.shouldResolve) return value;
		if (this.array) {
			const resolved = await Promise.all(value.map(data => this.serializer.deserialize(data, this, language, guild).catch(() => null)));
			return resolved.filter(val => val !== null);
		}
		return this.serializer.deserialize(value, this, language, guild).catch(() => null);
	}

	/**
	 * Parses a value into a resolved format for Settings
	 * @since 0.5.0
	 * @param {*} value A value to parse
	 * @param {external:Guild} [guild] A guild to use during parsing.
	 * @returns {*}
	 */
	async parse(value, guild) {
		const language = guild ? guild.language : this.client.languages.default;
		const val = await this.serializer.deserialize(value, this, language, guild);
		if (this.filter && this.filter(this.client, val, this, language)) throw language.get('SETTING_GATEWAY_INVALID_FILTERED_VALUE', this, value);
		return val;
	}

	/**
	 * Generate a default value if none is given
	 * @since 0.5.0
	 * @returns {(Array<*>|false|null)}
	 * @private
	 */
	_generateDefault() {
		if (this.array) return [];
		if (this.type === 'boolean') return false;
		return null;
	}

	/**
	 * Get a JSON object containing data from this SchemaEntry
	 * @since 0.5.0
	 * @returns {Object}
	 */
	toJSON() {
		return {
			array: this.array,
			configurable: this.configurable,
			default: this.default,
			max: this.max,
			min: this.min,
			type: this.type
		};
	}

}

module.exports = SchemaEntry;
