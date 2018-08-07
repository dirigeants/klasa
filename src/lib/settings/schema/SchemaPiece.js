const { isNumber, mergeDefault } = require('../../util/util');


/**
	* Creates our SchemaPiece instance
	* @param {SchemaFolder|Schema} parent The parent folder or schema for this piece instance
	* @param {string} key The name of this piece instance
	* @param {string} type The type for this piece instance
	* @param {Object} [options={}] The options for this SchemaPiece instance
	* @since 0.5.0
	*/
class SchemaPiece {

	constructor(parent, key, type, options = {}) {
		options = mergeDefault(parent.defaultOptions, options);
		/**
		  * The parent of this SchemaPiece, either a SchemaFolder instance or Schema instance
			* @name SchemaPiece#parent
			* @since 0.5.0
			* @returns {SchemaFolder|Schema}
			* @readonly
			*/
		Object.defineProperty(this, 'parent', { value: parent });

		/**
		  * The name of this SchemaPiece instance
			* @name SchemaPiece#key
			* @since 0.5.0
			* @returns {string}
			* @readonly
			*/
		Object.defineProperty(this, 'key', { value: key });

		/**
		  * The type this SchemaPiece instance is for
			* @since 0.5.0
			* @returns {string}
			*/
		this.type = type.toLowerCase();

		/**
		  * Whether or not this key should hold an array of data, or a single piece of data
			* @since 0.5.0
			* @returns {boolean}
			*/
		this.array = 'array' in options ? options.array : Array.isArray(options.default);

		/**
		  * The default data this key will revert back to if reset, or if the key is never set
			* @since 0.5.0
			* @returns {*}
			*/
		this.default = 'default' in options ? options.default : this._generateDefault();

		/**
		  * The minimum length or the minimum number a string or number key can be, respectively.
			* @since 0.5.0
			* @returns {?number}
			*/
		this.min = 'min' in options ? options.min : null;

		/**
		  * The maximum length or the maximum number a string or number key can be, respectively.
			* @since 0.5.0
			* @returns {?number}
			*/
		this.max = 'max' in options ? options.max : null;

		/**
		 * Whether this key should be configurable by the config command. When type is any, this key defaults to false.
		 * @since 0.5.0
		 * @type {boolean}
		 */
		this.configurable = 'configurable' in options ? options.configurable : this.type !== 'any';
	}

	/**
	  * The gateway this SchemaPiece is for
		*	@since 0.5.0
		* @returns {Gateway}
		* @readonly
		*/
	get gateway() {
		return this.parent.gateway;
	}

	/**
	 * The full path of this SchemaPiece starting from the Schema
	 * @since 0.5.0
	 * @returns {string}
	 * @readonly
	 */
	get path() {
		return `${this.parent.path}.${this.key}`;
	}

	/**
	  * Checks whether or not this SchemaPiece is valid.
		* @since 0.5.0
		* @returns {boolean}
		* @readonly
		*/
	isValid() {
		this._schemaCheckType(this.type);
		this._schemaCheckArray(this.array);
		this._schemaCheckLimits(this.min, this.max);
		this._schemaCheckConfigurable(this.configurable);
		this._schemaCheckDefault(this);

		return true;
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
	_schemaCheckType(type) {
		if (typeof type !== 'string') throw new TypeError(`[KEY] ${this.path} - Parameter type must be a string.`);
		if (!this.gateways.types.has(type)) throw new TypeError(`[KEY] ${this.path} - ${type} is not a valid type.`);
	}

	/**
	 * Checks if options.array is valid.
	 * @since 0.5.0
	 * @param {boolean} array The parameter to validate
	 * @throws {TypeError}
	 * @private
	 */
	_schemaCheckArray(array) {
		if (typeof array !== 'boolean') throw new TypeError(`[KEY] ${this.path} - Parameter array must be a boolean.`);
	}

	/**
	 * Checks if options.default is valid.
	 * @since 0.5.0
	 * @param {SchemaFolderAddOptions} options The options to validate
	 * @throws {TypeError}
	 * @private
	 */
	_schemaCheckDefault(options) {
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
	_schemaCheckLimits(min, max) {
		if (min !== null && !isNumber(min)) throw new TypeError(`[KEY] ${this.path} - Parameter min must be a number or null.`);
		if (max !== null && !isNumber(max)) throw new TypeError(`[KEY] ${this.path} - Parameter max must be a number or null.`);
		if (min !== null && max !== null && min > max) throw new TypeError(`[KEY] ${this.path} - Parameter min must contain a value lower than the parameter max.`);
	}

	/**
	 * Checks if options.configurable is valid.
	 * @since 0.5.0
	 * @param {boolean} configurable The parameter to validate
	 * @private
	 */
	_schemaCheckConfigurable(configurable) {
		if (typeof configurable !== 'boolean') throw new TypeError(`[KEY] ${this.path} - Parameter configurable must be a boolean.`);
	}

	/**
	 * Get a JSON object containing data from this SchemaPiece
	 * @since 0.5.0
	 * @returns {Object}
	 */
	toJSON() {
		return {
			type: this.type,
			array: this.array,
			default: this.default,
			min: this.min,
			max: this.max,
			configurable: this.configurable
		};
	}

}

module.exports = SchemaPiece;
