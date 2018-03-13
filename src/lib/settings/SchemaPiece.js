const { isNumber, isObject } = require('../util/util');
const Schema = require('./Schema');
const fs = require('fs-nextra');

/**
 * <info>You should never create an instance of this class. Use {@link SchemaFolder#add} instead.</info>
 * The SchemaPiece class that contains the data for a key and several helpers.
 * @extends Schema
 */
class SchemaPiece extends Schema {

	/**
	 * @typedef {Object} SchemaPieceEditOptions
	 * @property {*} [default] The new default value
	 * @property {number} [min] The new minimum range value
	 * @property {number} [max] The new maximum range value
	 * @property {boolean} [configurable] The new configurable value
	 * @property {string} [sql] The new sql datatype
	 */

	/**
	 * @typedef {Object} SchemaPieceJSON
	 * @property {string} type The type for the key
	 * @property {*} default The default value for the key
	 * @property {number} min The min value for the key (String.length for String, value for number)
	 * @property {number} max The max value for the key (String.length for String, value for number)
	 * @property {string} sql A tuple containing the name of the column and its data type
	 * @property {boolean} array Whether the key should be stored as Array or not
	 * @property {boolean} configurable Whether the key should be configurable by the config command or not
	 */

	/**
	 * @since 0.5.0
	 * @param {KlasaClient} client The client which initialized this instance
	 * @param {Gateway} gateway The Gateway that manages this schema instance
	 * @param {SchemaFolderAddOptions} options The object containing the properties for this schema instance
	 * @param {SchemaFolder} parent The parent which holds this instance
	 * @param {string} key The name of the key
	 */
	constructor(client, gateway, options, parent, key) {
		super(client, gateway, options, parent, key);

		/**
		 * The type of this key.
		 * @since 0.5.0
		 * @type {string}
		 * @name SchemaPiece#type
		 */
		this.type = options.type.toLowerCase();

		/**
		 * Whether this key should store multiple or a single value.
		 * @since 0.5.0
		 * @type {boolean}
		 * @name SchemaPiece#array
		 */
		this.array = 'array' in options ? options.array : Array.isArray(options.default);

		/**
		 * What this key should provide by default.
		 * @since 0.5.0
		 * @type {*}
		 * @name SchemaPiece#default
		 */
		this.default = 'default' in options ? options.default : this._generateDefault();

		/**
		 * The minimum value for this key.
		 * @since 0.5.0
		 * @type {?number}
		 * @name SchemaPiece#min
		 */
		this.min = 'min' in options ? options.min : null;

		/**
		 * The maximum value for this key.
		 * @since 0.5.0
		 * @type {?number}
		 * @name SchemaPiece#max
		 */
		this.max = 'max' in options ? options.max : null;

		/**
		 * A tuple of strings containing the path and the datatype.
		 * @since 0.5.0
		 * @type {string[]}
		 * @name SchemaPiece#sql
		 */
		this.sql = [this.path, null];

		/**
		 * Whether this key should be configurable by the config command. When type is any, this key defaults to false.
		 * @since 0.5.0
		 * @type {boolean}
		 * @name SchemaPiece#configurable
		 */
		this.configurable = 'configurable' in options ? options.configurable : this.type !== 'any';

		/**
		 * The validator function for this instance.
		 * @since 0.5.0
		 * @type {?Function}
		 */
		this.validator = null;

		this._init(options);
	}

	/**
	 * Set a validator function for this instance.
	 * @since 0.5.0
	 * @param {Function} fn The validator function
	 * @returns {this}
	 * @chainable
	 */
	setValidator(fn) {
		if (typeof fn !== 'function') throw new TypeError(`[TYPE] ${this} - SchemaPiece#setValidator expects a function. Got: ${typeof fn}`);
		this.validator = fn.bind(this);

		return this;
	}

	/**
	 * Parse a value in this key's resolver.
	 * @since 0.5.0
	 * @param {string} value The value to parse
	 * @param {KlasaGuild} guild A Guild instance required for the resolver to work
	 * @returns {*}
	 */
	async parse(value, guild) {
		const resolved = await this.gateway.resolver[this.type](value, guild, this.key, { min: this.min, max: this.max });
		if (this.validator) await this.validator(resolved, guild);
		return resolved;
	}

	/**
	 * Modify this SchemaPiece's properties.
	 * @since 0.5.0
	 * @param {SchemaPieceEditOptions} options The new options
	 * @returns {this}
	 */
	async edit(options) {
		// Check if the 'options' parameter is an object.
		if (!isObject(options)) throw new TypeError(`SchemaPiece#edit expected an object as a parameter. Got: ${typeof options}`);

		const edited = new Set();
		if (typeof options.sql === 'string' && this.sql[1] !== options.sql) {
			this.sql[1] = options.sql;
			edited.add('SQL');
			if (this.gateway.sql) await this.gateway.provider.updateColumn(this.gateway.type, this.path, options.sql);
		}
		if (typeof options.default !== 'undefined' && this.default !== options.default) {
			this._schemaCheckDefault({ ...this.toJSON(), ...options });
			this.default = options.default;
			if (!edited.has('SQL')) this.sql[1] = this._generateSQLDatatype(options.sql);
			edited.add('DEFAULT');
		}
		if (typeof options.min !== 'undefined' && this.min !== options.min) {
			this._schemaCheckLimits(options.min, typeof options.max !== 'undefined' ? options.max : this.max);
			this.min = options.min;
			edited.add('MIN');
		}
		if (typeof options.max !== 'undefined' && this.max !== options.max) {
			this._schemaCheckLimits(typeof options.min !== 'undefined' ? options.min : this.min, options.max);
			this.max = options.max;
			edited.add('MAX');
		}
		if (typeof options.configurable !== 'undefined' && this.configurable !== options.configurable) {
			this._schemaCheckConfigurable(options.configurable);
			this.configurable = options.configurable;
			edited.add('CONFIGURABLE');
		}
		if (edited.size > 0) {
			await fs.outputJSONAtomic(this.gateway.filePath, this.gateway.schema.toJSON());
			if (this.gateway.sql && this.gateway.provider.updateColumn === 'function') {
				this.gateway.provider.updateColumn(this.gateway.type, this.key, this._generateSQLDatatype(options.sql));
			}
			await this.parent._shardSyncSchema(this, 'update', false);
			if (this.client.listenerCount('schemaKeyUpdate')) this.client.emit('schemaKeyUpdate', this);
		}

		return this;
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
		if (typeof type !== 'string') throw new TypeError(`[KEY] ${this} - Parameter type must be a string.`);
		if (!this.client.gateways.types.has(type)) throw new TypeError(`[KEY] ${this} - ${type} is not a valid type.`);
	}

	/**
	 * Checks if options.array is valid.
	 * @since 0.5.0
	 * @param {boolean} array The parameter to validate
	 * @throws {TypeError}
	 * @private
	 */
	_schemaCheckArray(array) {
		if (typeof array !== 'boolean') throw new TypeError(`[KEY] ${this} - Parameter array must be a boolean.`);
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
			if (!Array.isArray(options.default)) throw new TypeError(`[DEFAULT] ${this} - Default key must be an array if the key stores an array.`);
		} else if (options.type === 'boolean' && typeof options.default !== 'boolean') {
			throw new TypeError(`[DEFAULT] ${this} - Default key must be a boolean if the key stores a boolean.`);
		} else if (options.type === 'string' && typeof options.default !== 'string' && options.default !== null) {
			throw new TypeError(`[DEFAULT] ${this} - Default key must be either a string or null if the key stores a string.`);
		} else if (options.type !== 'any' && typeof options.default === 'object' && options.default !== null) {
			throw new TypeError(`[DEFAULT] ${this} - Default key must not be type of object unless it is type any or null.`);
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
		if (min !== null && !isNumber(min)) throw new TypeError(`[KEY] ${this} - Parameter min must be a number or null.`);
		if (max !== null && !isNumber(max)) throw new TypeError(`[KEY] ${this} - Parameter max must be a number or null.`);
		if (min !== null && max !== null && min > max) throw new TypeError(`[KEY] ${this} - Parameter min must contain a value lower than the parameter max.`);
	}

	/**
	 * Checks if options.configurable is valid.
	 * @since 0.5.0
	 * @param {boolean} configurable The parameter to validate
	 * @private
	 */
	_schemaCheckConfigurable(configurable) {
		if (typeof configurable !== 'boolean') throw new TypeError(`[KEY] ${this} - Parameter configurable must be a boolean.`);
	}

	/**
	 * Generate a new SQL datatype.
	 * @since 0.5.0
	 * @param {string} [sql] The new SQL datatype
	 * @returns {string}
	 * @private
	 */
	_generateSQLDatatype(sql) {
		return typeof sql === 'string' ? sql : (this.type === 'integer' || this.type === 'float' ? 'INTEGER' :
			this.max !== null ? `VARCHAR(${this.max})` : 'TEXT') + (this.default !== null ? ` DEFAULT ${SchemaPiece._parseSQLValue(this.default)}` : '');
	}

	/**
	 * Patch an object applying all its properties to this instance.
	 * @since 0.5.0
	 * @param {Object} object The object to patch
	 * @private
	 */
	_patch(object) {
		if (typeof object.array === 'boolean') this.array = object.array;
		if (typeof object.default !== 'undefined') this.default = object.default;
		if (typeof object.min === 'number') this.min = object.min;
		if (typeof object.max === 'number') this.max = object.max;
		if (typeof object.sql === 'string') this.sql[1] = object.sql;
		if (typeof object.configurable === 'boolean') this.configurable = object.configurable;
	}

	/**
	 * Check if the key is properly configured.
	 * @since 0.5.0
	 * @param {SchemaFolderAddOptions} options The options to parse
	 * @returns {true}
	 * @throws {TypeError}
	 * @private
	 */
	_init(options) {
		if (this._inited) throw new TypeError(`[INIT] ${this} - Is already init. Aborting re-init.`);
		this._inited = true;

		// Check if the 'options' parameter is an object.
		if (!isObject(options)) throw new TypeError(`SchemaPiece#init expected an object as a parameter. Got: ${typeof options}`);
		this.sql[1] = this._generateSQLDatatype(options.sql);

		return true;
	}

	/**
	 * Get this key's raw data in JSON.
	 * @since 0.5.0
	 * @returns {SchemaPieceJSON}
	 */
	toJSON() {
		return {
			type: this.type,
			array: this.array,
			default: this.default,
			min: this.min,
			max: this.max,
			sql: this.sql[1],
			configurable: this.configurable
		};
	}

	/**
	 * Stringify a value or the instance itself.
	 * @since 0.5.0
	 * @returns {string}
	 */
	toString() {
		return `SchemaPiece(${this.gateway.type}:${this.path})`;
	}

	/**
	 * Parses a value to a valid string that can be used for SQL input.
	 * @since 0.5.0
	 * @param {*} value The value to parse
	 * @returns {string}
	 * @private
	 */
	static _parseSQLValue(value) {
		const type = typeof value;
		if (type === 'boolean' || type === 'number' || value === null) return String(value);
		if (type === 'string') return `'${value.replace(/'/g, "''")}'`;
		if (type === 'object') return `'${JSON.stringify(value).replace(/'/g, "''")}'`;
		return '';
	}

}

module.exports = SchemaPiece;
