const { isFunction, isNumber } = require('../../util/util');

class SchemaPiece {

	/**
	 * @typedef {Object} SchemaPieceOptions
	 * @property {*} [default] The default value for the key
	 * @property {Function} [filter] The filter to use when resolving this key. The function is passed the resolved value from the resolver, and a guild.
	 * @property {boolean} [array] Whether the key should be stored as Array or not
	 * @property {boolean} [configurable] Whether the key should be configurable by the configuration command or not
	 * @property {number} [min] The minimum value for this piece
	 * @property {number} [max] The maximum value for this piece
	 */

	/**
	 * @typedef {SchemaPieceOptions} SchemaPieceEditOptions
	 * @property {string} [type] The new type for this SchemaPiece
	 */

	/**
	 * Creates our SchemaPiece instance
	 * @param {SchemaFolder|Schema} parent The parent folder or schema for this piece instance
	 * @param {string} key The name of this piece instance
	 * @param {string} type The type for this piece instance
	 * @param {SchemaPieceOptions} [options={}] The options for this SchemaPiece instance
	 * @since 0.5.0
	 */
	constructor(parent, key, type, options = {}) {
		/**
		 * The KlasaClient for this SchemaPiece
		 * @name SchemaPiece#Client
		 * @since 0.5.0
		 * @readonly
		 * @type {KlasaClient}
		 */
		Object.defineProperty(this, 'client', { value: null, writable: true });

		/**
		 * The parent of this SchemaPiece, either a SchemaFolder instance or Schema instance
		 * @name SchemaPiece#parent
		 * @since 0.5.0
		 * @readonly
		 * @type {SchemaFolder|Schema}
		 */
		Object.defineProperty(this, 'parent', { value: parent });

		/**
		 * The name of this SchemaPiece instance
		 * @name SchemaPiece#key
		 * @since 0.5.0
		 * @readonly
		 * @type {string}
		 */
		Object.defineProperty(this, 'key', { value: key });

		/**
		 * The path of this SchemaPiece instance
		 * @name SchemaPiece#path
		 * @since 0.5.0
		 * @readonly
		 * @type {string}
		 */
		Object.defineProperty(this, 'path', { value: `${this.parent.path ? `${this.parent.path}.` : ''}${this.key}` });

		/**
		 * The type this SchemaPiece instance is for
		 * @since 0.5.0
		 * @type {string}
		 */
		this.type = type.toLowerCase();

		/**
		 * Whether or not this key should hold an array of data, or a single piece of data
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
	}

	/**
	 * The serializer for this SchemaPiece
	 * @since 0.5.0
	 * @type {Serializer}
	 * @readonly
	 */
	get serializer() {
		return this.client.serializers.get(this.type);
	}

	/**
	 * Edit this SchemaPiece's properties
	 * @since 0.5.0
	 * @param {SchemaPieceEditOptions} [options={}] The options for this SchemaPiece
	 * @returns {this}
	 */
	edit(options = {}) {
		if ('type' in options) {
			this._checkType(options.type);
			this.type = options.type;
		}
		if ('array' in options) {
			this._checkArray(options.array);
			this.array = options.array;
		}
		if ('configurable' in options) {
			this._checkConfigurable(options.configurable);
			this.configurable = options.configurable;
		}
		if (('min' in options) || ('max' in options)) {
			const { min = null, max = null } = options;
			this._checkLimits(min, max);
			this.min = min;
			this.max = max;
		}
		if ('filter' in options) {
			this._checkFilter(options.filter);
			this.filter = options.filter;
		}
		if ('default' in options) {
			this._checkDefault(options);
			this.default = options.default;
		}

		return this;
	}

	/**
	 * Checks whether or not this SchemaPiece is valid.
	 * @since 0.5.0
	 * @returns {boolean}
	 */
	isValid() {
		this._checkType(this.type);
		this._checkArray(this.array);
		this._checkConfigurable(this.configurable);
		this._checkLimits(this.min, this.max);
		this._checkFilter(this.filter);
		this._checkDefault(this);

		return true;
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
		const val = await this.serializer.serialize(value, this, language, guild);
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
	 * Checks if options.type is valid.
	 * @since 0.5.0
	 * @param {string} type The parameter to validate
	 * @throws {TypeError}
	 * @private
	 */
	_checkType(type) {
		if (typeof type !== 'string') throw new TypeError(`[KEY] ${this.path} - Parameter type must be a string.`);
		if (!this.client.seriralizers.has(type)) throw new TypeError(`[KEY] ${this.path} - ${type} is not a valid type.`);
	}

	/**
	 * Checks if options.array is valid.
	 * @since 0.5.0
	 * @param {boolean} array The parameter to validate
	 * @throws {TypeError}
	 * @private
	 */
	_checkArray(array) {
		if (typeof array !== 'boolean') throw new TypeError(`[KEY] ${this.path} - Parameter array must be a boolean.`);
	}

	/**
	 * Checks if options.default is valid.
	 * @since 0.5.0
	 * @param {SchemaFolderAddOptions} options The options to validate
	 * @throws {TypeError}
	 * @private
	 */
	_checkDefault(options) {
		if (options.array === true) {
			if (!Array.isArray(options.default)) throw new TypeError(`[DEFAULT] ${this.path} - Default key must be an array if the key stores an array.`);
		} else if (options.type === 'boolean' && typeof options.default !== 'boolean') {
			throw new TypeError(`[DEFAULT] ${this.path} - Default key must be a boolean if the key stores a boolean.`);
		} else if (options.type === 'string' && typeof options.default !== 'string' && options.default !== null) {
			throw new TypeError(`[DEFAULT] ${this.path} - Default key must be either a string or null if the key stores a string.`);
		}
	}

	/**
	 * Checks if options.min and options.max are valid.
	 * @since 0.5.0
	 * @param {number} min The options.min parameter to validate
	 * @param {number} max The options.max parameter to validate
	 * @private
	 */
	_checkLimits(min, max) {
		if (min !== null && !isNumber(min)) throw new TypeError(`[KEY] ${this.path} - Parameter min must be a number or null.`);
		if (max !== null && !isNumber(max)) throw new TypeError(`[KEY] ${this.path} - Parameter max must be a number or null.`);
		if (min !== null && max !== null && min > max) throw new TypeError(`[KEY] ${this.path} - Parameter min must contain a value lower than the parameter max.`);
	}

	/**
	 * Check if options.filter is valid.
	 * @since 0.5.0
	 * @param {boolean} configurable The paramter to validate
	 * @throws {TypeError}
	 * @private
	 */
	_checkConfigurable(configurable) {
		if (typeof configurable !== 'boolean') throw new TypeError(`[KEY] ${this.path} - Parameter configurable must be a boolean.`);
	}

	/**
	 * Check if options.filter is valid.
	 * @since 0.5.0
	 * @param {Function} filter The parameter to validate
	 * @throws {TypeError}
	 * @private
	 */
	_checkFilter(filter) {
		if (filter !== null && !isFunction(filter)) throw new TypeError(`[KEY] ${this.path} - Parameter filter must be a function`);
	}

	/**
	 * Get a JSON object containing data from this SchemaPiece
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

module.exports = SchemaPiece;
