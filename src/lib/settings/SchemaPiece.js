/**
 * The SchemaPiece class that contains the data for a key and several helpers.
 */
class SchemaPiece {

	/**
	 * @typedef  {Object} SchemaPieceJSON
	 * @property {string}  type The type for the key.
	 * @property {any}     default The default value for the key.
	 * @property {number}  min The min value for the key (String.length for String, value for number).
	 * @property {number}  max The max value for the key (String.length for String, value for number).
	 * @property {boolean} array Whether the key should be stored as Array or not.
	 * @property {boolean} configurable Whether the key should be configurable by the config command or not.
	 */

	/**
	 * @since 0.4.0
	 * @param {KlasaClient} client The client which initialized this instance.
	 * @param {(Gateway|GatewaySQL)} manager The Gateway that manages this schema instance.
	 * @param {AddOptions} options The object containing the properties for this schema instance.
	 * @param {string} path The path for this schema instance.
	 * @param {string} key The name of the key.
	 */
	constructor(client, manager, options, path, key) {
		/**
		 * The Klasa client.
		 * @since 0.4.0
		 * @type {KlasaClient}
		 * @name SchemaPiece#client
		 * @readonly
		 */
		Object.defineProperty(this, 'client', { value: client });

		/**
		 * The Gateway that manages this SchemaPiece instance.
		 * @since 0.4.0
		 * @type {(Gateway|GatewaySQL)}
		 * @name SchemaPiece#manager
		 * @readonly
		 */
		Object.defineProperty(this, 'manager', { value: manager });

		/**
		 * The path of this SchemaPiece instance.
		 * @since 0.4.0
		 * @type {string}
		 * @name SchemaPiece#path
		 * @readonly
		 */
		Object.defineProperty(this, 'path', { value: path });

		/**
		 * This keys' name.
		 * @since 0.4.0
		 * @type {string}
		 * @name SchemaPiece#key
		 * @readonly
		 */
		Object.defineProperty(this, 'key', { value: key });

		/**
		 * The type of this key.
		 * @since 0.4.0
		 * @type {string}
		 * @name SchemaPiece#type
		 */
		this.type = options.type.toLowerCase();

		/**
		 * Whether this key should store multiple or a single value.
		 * @since 0.4.0
		 * @type {boolean}
		 * @name SchemaPiece#array
		 */
		this.array = typeof options.array !== 'undefined' ? options.array : false;

		/**
		 * What this key should provide by default.
		 * @since 0.4.0
		 * @type {any}
		 * @name SchemaPiece#default
		 */
		this.default = typeof options.default !== 'undefined' ? options.default : this.type === 'boolean' ? false : null;

		/**
		 * The minimum value for this key.
		 * @since 0.4.0
		 * @type {?number}
		 * @name SchemaPiece#min
		 */
		this.min = typeof options.min !== 'undefined' && isNaN(options.min) === false ? options.min : null;

		/**
		 * The maximum value for this key.
		 * @since 0.4.0
		 * @type {?number}
		 * @name SchemaPiece#max
		 */
		this.max = typeof options.max !== 'undefined' && isNaN(options.max) === false ? options.max : null;

		/**
		 * Whether this key should be configureable by the config command. When type is any, this key defaults to false.
		 * @since 0.4.0
		 * @type {boolean}
		 * @name SchemaPiece#configurable
		 */
		this.configurable = typeof options.configurable !== 'undefined' ? options.configurable : this.type !== 'any';

		this.init(options);
	}

	/**
	 * Parse a value in this key's resolver.
	 * @since 0.4.0
	 * @param {string} value The value to parse.
	 * @param {external:Guild} guild A Guild instance required for the resolver to work.
	 * @returns {Promise<any>}
	 */
	parse(value, guild) {
		return this.manager.resolver[this.type](value, guild, this.key, { min: this.min, max: this.max });
	}

	/**
	 * Get this key's raw data in JSON.
	 * @since 0.4.0
	 * @returns {SchemaPieceJSON}
	 */
	toJSON() {
		return {
			type: this.type,
			array: this.array,
			default: this.default,
			min: this.min,
			max: this.max,
			sql: this.sqlSchema[1],
			configurable: this.configurable
		};
	}

	/**
	 * Check if the key is properly configured.
	 * @since 0.4.0
	 * @param {AddOptions} options The options to parse.
	 */
	init(options) {
		// Check if the 'options' parameter is an object.
		if (typeof options !== 'object' || Object.prototype.toString.call(options) !== '[object Object]') {
			throw new TypeError(`SchemaPiece#init expected an object as first parameter. Got: ${typeof options}`);
		}
		if (typeof this.type !== 'string') {
			throw new TypeError(`[KEY] ${this} - Parameter type must be a string.`);
		}
		if (typeof this.array !== 'boolean') {
			throw new TypeError(`[KEY] ${this} - Parameter array must be a boolean.`);
		}
		// Default value checking
		if (this.type === 'boolean' && typeof this.default !== 'boolean') {
			throw new TypeError(`[DEFAULT] ${this} - Default key must be a boolean if the key stores a boolean.`);
		}
		if (this.type === 'string' && typeof this.default !== 'string' && this.default !== null) {
			throw new TypeError(`[DEFAULT] ${this} - Default key must be either a string or null if the key stores a string.`);
		}
		if (this.array === true && Array.isArray(this.default) === false) {
			throw new TypeError(`[DEFAULT] ${this} - Default key must be an array if the key stores an array.`);
		} else if (this.type !== 'any' && typeof this.default === 'object' && this.default !== null) {
			throw new TypeError(`[DEFAULT] ${this} - Default key must not be type of object unless it is type any or null.`);
		}
		// Min and max checking
		if (this.min !== null && !isNumber(this.min)) {
			throw new TypeError(`[KEY] ${this} - Parameter min must be a number or null.`);
		}
		if (this.max !== null && !isNumber(this.max)) {
			throw new TypeError(`[KEY] ${this} - Parameter max must be a number or null.`);
		}
		if (this.min !== null && this.max !== null && this.min > this.max) {
			throw new TypeError(`[KEY] ${this} - Parameter min must contain a value lower than the parameter max.`);
		}
		// Configurable checking
		if (typeof this.configurable !== 'boolean') {
			throw new TypeError(`[KEY] ${this} - Parameter configurable must be a boolean.`);
		}

		const value = [this.path, options.sql || (this.type === 'integer' || this.type === 'float' ? 'INTEGER' : 'TEXT') +
			(this.default !== null ? ` DEFAULT ${SchemaPiece._parseSQLValue(this.default)}` : '')];

		Object.defineProperty(this, 'sqlSchema', { value });
	}

	/**
	 * Get the SQL key and datatype.
	 * @since 0.4.0
	 * @param {Array<string[]>} [array] An array to push.
	 * @returns {string[]}
	 */
	getSQL(array) {
		if (typeof array !== 'undefined') array.push(this.sqlSchema);
		return this.sqlSchema;
	}

	/**
	 * Get the current key.
	 * @since 0.4.0
	 * @param {string[]} [array] An array to push.
	 * @returns {string}
	 */
	getKeys(array) {
		if (typeof array !== 'undefined') array.push(this.path);
		return this.path;
	}

	/**
	 * Passes the instance to an array
	 * @since 0.4.0
	 * @param {SchemaPiece[]} [array] An array to push.
	 * @returns {this}
	 */
	getValues(array) {
		if (typeof array !== 'undefined') array.push(this);
		return this;
	}

	/**
	 * Resolve a string.
	 * @since 0.4.0
	 * @param {external:Message} msg The Message to use.
	 * @param {any} value The current value of the key.
	 * @returns {string}
	 */
	resolveString(msg, value) {
		let resolver = (val) => val;
		switch (this.type) {
			case 'Folder': resolver = () => '[ Folder';
				break;
			case 'user': resolver = (val) => (this.client.users.get(val) || { username: val }).username;
				break;
			case 'textchannel':
			case 'voicechannel':
			case 'channel': resolver = (val) => `#${(msg.guild.channels.get(val) || { name: val }).name}`;
				break;
			case 'role': resolver = (val) => `@${(msg.guild.roles.get(val) || { name: val }).name}`;
				break;
			case 'guild': resolver = (val) => val.name;
				break;
			case 'boolean': resolver = (val) => val === true ? 'Active' : 'Inactive';
				break;
			// no default
		}

		if (this.array && Array.isArray(value)) return value.length > 0 ? `[ ${value.map(resolver).join(' | ')} ]` : 'None';
		return value === null ? 'Not set' : resolver(value);
	}

	/**
	 * Stringify a value or the instance itself.
	 * @since 0.4.0
	 * @returns {string}
	 */
	toString() {
		return `SchemaPiece(${this.manager.type}:${this.path})`;
	}

	/**
	 * Parses a value to a valid string that can be used for SQL input.
	 * @since 0.4.0
	 * @param {any} value The value to parse.
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

function isNumber(number) {
	return typeof number === 'number' && !isNaN(number) && Number.isFinite(number);
}

module.exports = SchemaPiece;
