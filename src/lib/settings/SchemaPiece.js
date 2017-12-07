const { isNumber, isObject } = require('../util/util');
const fs = require('fs-nextra');

/**
 * The SchemaPiece class that contains the data for a key and several helpers.
 */
class SchemaPiece {

	/**
	 * @typedef  {Object} SchemaPieceJSON
	 * @property {string} type The type for the key.
	 * @property {*} default The default value for the key.
	 * @property {number} min The min value for the key (String.length for String, value for number).
	 * @property {number} max The max value for the key (String.length for String, value for number).
	 * @property {string[]} sql A tuple containing the name of the column and its data type.
	 * @property {boolean} array Whether the key should be stored as Array or not.
	 * @property {boolean} configurable Whether the key should be configurable by the config command or not.
	 * @memberof SchemaPiece
	 */

	/**
	 * @typedef  {Object} ModifyOptions
	 * @property {*} [default] The new default value.
	 * @property {number} [min] The new minimum range value.
	 * @property {number} [max] The new maximum range value.
	 * @property {boolean} [configurable] The new configurable value.
	 * @property {string} [sql] The new sql datatype.
	 * @memberof SchemaPiece
	 */

	/**
	 * @since 0.5.0
	 * @param {KlasaClient} client The client which initialized this instance.
	 * @param {(Gateway|GatewaySQL)} manager The Gateway that manages this schema instance.
	 * @param {AddOptions} options The object containing the properties for this schema instance.
	 * @param {Schema} parent The parent which holds this instance.
	 * @param {string} key The name of the key.
	 */
	constructor(client, manager, options, parent, key) {
		/**
		 * The Klasa client.
		 * @since 0.5.0
		 * @type {KlasaClient}
		 * @name SchemaPiece#client
		 * @readonly
		 */
		Object.defineProperty(this, 'client', { value: client });

		/**
		 * The Gateway that manages this SchemaPiece instance.
		 * @since 0.5.0
		 * @type {(Gateway|GatewaySQL)}
		 * @name SchemaPiece#manager
		 * @readonly
		 */
		Object.defineProperty(this, 'manager', { value: manager });

		/**
		 * The Schema instance that is parent of this instance.
		 * @since 0.5.0
		 * @type {Schema}
		 * @name SchemaPiece#parent
		 * @readonly
		 */
		Object.defineProperty(this, 'parent', { value: parent });

		/**
		 * The path of this SchemaPiece instance.
		 * @since 0.5.0
		 * @type {string}
		 * @name SchemaPiece#path
		 * @readonly
		 */
		Object.defineProperty(this, 'path', { value: `${parent && parent.path.length > 0 ? `${parent.path}.` : ''}${key}` });

		/**
		 * This keys' name.
		 * @since 0.5.0
		 * @type {string}
		 * @name SchemaPiece#key
		 * @readonly
		 */
		Object.defineProperty(this, 'key', { value: key });

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
		this.array = typeof options.array !== 'undefined' ? options.array : false;

		/**
		 * What this key should provide by default.
		 * @since 0.5.0
		 * @type {*}
		 * @name SchemaPiece#default
		 */
		this.default = typeof options.default !== 'undefined' ? options.default : this.type === 'boolean' ? false : null;

		/**
		 * The minimum value for this key.
		 * @since 0.5.0
		 * @type {?number}
		 * @name SchemaPiece#min
		 */
		this.min = typeof options.min !== 'undefined' && isNaN(options.min) === false ? options.min : null;

		/**
		 * The maximum value for this key.
		 * @since 0.5.0
		 * @type {?number}
		 * @name SchemaPiece#max
		 */
		this.max = typeof options.max !== 'undefined' && isNaN(options.max) === false ? options.max : null;

		/**
		 * A tuple of strings containing the path and the datatype.
		 * @since 0.5.0
		 * @type {string[]}
		 * @name SchemaPiece#sql
		 */
		this.sql = [this.path];

		/**
		 * Whether this key should be configureable by the config command. When type is any, this key defaults to false.
		 * @since 0.5.0
		 * @type {boolean}
		 * @name SchemaPiece#configurable
		 */
		this.configurable = typeof options.configurable !== 'undefined' ? options.configurable : this.type !== 'any';

		/**
		 * The path of this SchemaPiece instance.
		 * @since 0.5.0
		 * @type {boolean}
		 * @name SchemaPiece#_inited
		 * @readonly
		 * @private
		 */
		Object.defineProperty(this, '_inited', { value: this.init(options) });
	}

	/**
	 * Parse a value in this key's resolver.
	 * @since 0.5.0
	 * @param {string} value The value to parse.
	 * @param {KlasaGuild} guild A Guild instance required for the resolver to work.
	 * @returns {Promise<*>}
	 */
	parse(value, guild = this.client.guilds.get(this.id)) {
		return this.manager.resolver[this.type](value, guild, this.key, { min: this.min, max: this.max });
	}

	/**
	 * Resolve a string.
	 * @since 0.5.0
	 * @param {KlasaMessage} msg The Message to use.
	 * @returns {string}
	 */
	resolveString(msg) {
		const value = this.manager.type === 'users' ? msg.author.configs.get(this.path) : msg.guildConfigs.get(this.path);
		if (value === null) return 'Not set';

		let resolver = (val) => val;
		switch (this.type) {
			case 'Folder': resolver = () => 'Folder';
				break;
			case 'user': resolver = (val) => (this.client.users.get(val) || { username: val && val.username ? val.username : val }).username;
				break;
			case 'textchannel':
			case 'voicechannel':
			case 'channel': resolver = (val) => (msg.guild.channels.get(val) || { name: val && val.name ? val.name : val }).name;
				break;
			case 'role': resolver = (val) => (msg.guild.roles.get(val) || { name: val && val.name ? val.name : val }).name;
				break;
			case 'guild': resolver = (val) => val && val.name ? val.name : val;
				break;
			case 'boolean': resolver = (val) => val === true ? 'Enabled' : 'Disabled';
				break;
			// no default
		}

		if (this.array && Array.isArray(value)) return value.length > 0 ? `[ ${value.map(resolver).join(' | ')} ]` : 'None';
		return resolver(value);
	}

	/**
	 * Modify this SchemaPiece's properties.
	 * @since 0.5.0
	 * @param {ModifyOptions} options The new options.
	 * @returns {Promise<this>}
	 */
	async modify(options) {
		// Check if the 'options' parameter is an object.
		if (!isObject(options)) throw new TypeError(`SchemaPiece#modify expected an object as a parameter. Got: ${typeof options}`);

		const edited = new Set();
		if (typeof options.default !== 'undefined' && this.default !== options.default) {
			this._schemaCheckDefault(Object.assign(this.toJSON(), options));
			this.default = options.default;
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
		if (typeof options.sql === 'string' && this.sql[1] !== options.sql) {
			this.sql[1] = options.sql;
			edited.add('SQL');
		}
		if (edited.size > 0) {
			await fs.outputJSONAtomic(this.manager.filePath, this.manager.schema.toJSON());
			if (this.manager.sql && this.manager.provider.updateColumn === 'function') {
				this.manager.provider.updateColumn(this.manager.type, this.key, this._generateSQLDatatype(options.sql));
			}
			if (this.client.listenerCount('schemaKeyUpdate')) this.client.emit('schemaKeyUpdate', this);
		}

		return this;
	}

	/**
	 * Check if the key is properly configured.
	 * @since 0.5.0
	 * @param {AddOptions} options The options to parse.
	 * @returns {true}
	 * @private
	 */
	init(options) {
		if (this._inited) throw new TypeError(`[INIT] ${this} - Is already init. Aborting re-init.`);
		// Check if the 'options' parameter is an object.
		if (!isObject(options)) throw new TypeError(`SchemaPiece#init expected an object as a parameter. Got: ${typeof options}`);
		this._schemaCheckType(this.type);
		this._schemaCheckArray(this.array);
		this._schemaCheckDefault(this.default, this.type, this.array);
		this._schemaCheckLimits(this.min, this.max);
		this._schemaCheckConfigurable(this.configurable);

		this.sql[1] = this._generateSQLDatatype(options.sql);

		return true;
	}

	/**
	 * Checks if options.type is valid.
	 * @since 0.5.0
	 * @param {string} type The parameter to validate.
	 * @private
	 */
	_schemaCheckType(type) {
		if (typeof type !== 'string') throw new TypeError(`[KEY] ${this} - Parameter type must be a string.`);
		if (!this.manager.store.types.includes(type)) throw new TypeError(`[KEY] ${this} - ${type} is not a valid type.`);
	}

	/**
	 * Checks if options.array is valid.
	 * @since 0.5.0
	 * @param {boolean} array The parameter to validate.
	 * @private
	 */
	_schemaCheckArray(array) {
		if (typeof array !== 'boolean') throw new TypeError(`[KEY] ${this} - Parameter array must be a boolean.`);
	}

	/**
	 * Checks if options.default is valid.
	 * @since 0.5.0
	 * @param {AddOptions} options The options to validate.
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
	 * @param {number} min The options.min parameter to validate.
	 * @param {number} max The options.max parameter to validate.
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
	 * @param {boolean} configurable The parameter to validate.
	 * @private
	 */
	_schemaCheckConfigurable(configurable) {
		if (typeof configurable !== 'boolean') throw new TypeError(`[KEY] ${this} - Parameter configurable must be a boolean.`);
	}

	/**
	 * Generate a new SQL datatype.
	 * @since 0.5.0
	 * @param {string} [sql] The new SQL datatype.
	 * @returns {string}
	 * @private
	 */
	_generateSQLDatatype(sql) {
		return typeof sql === 'string' ? sql : (this.type === 'integer' || this.type === 'float' ? 'INTEGER' :
			this.max !== null ? `VARCHAR(${this.max})` : 'TEXT') + (this.default !== null ? ` DEFAULT ${SchemaPiece._parseSQLValue(this.default)}` : '');
	}

	/**
	 * Stringify a value or the instance itself.
	 * @since 0.5.0
	 * @returns {string}
	 */
	toString() {
		return `SchemaPiece(${this.manager.type}:${this.path})`;
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
	 * Parses a value to a valid string that can be used for SQL input.
	 * @since 0.5.0
	 * @param {*} value The value to parse.
	 * @returns {string}
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
