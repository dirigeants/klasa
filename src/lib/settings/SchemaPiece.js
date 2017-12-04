const { isNumber } = require('../util/util');

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

		this.init(options);
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
	 * Check if the key is properly configured.
	 * @since 0.5.0
	 * @param {AddOptions} options The options to parse.
	 * @private
	 */
	init(options) {
		// Check if the 'options' parameter is an object.
		if (!options || Object.prototype.toString.call(options) !== '[object Object]') throw new TypeError(`SchemaPiece#init expected an object as first parameter. Got: ${typeof options}`);
		if (typeof this.type !== 'string') throw new TypeError(`[KEY] ${this} - Parameter type must be a string.`);
		if (!this.manager.store.types.includes(this.type)) throw new TypeError(`[KEY] ${this} - ${this.type} is not a valid type.`);
		if (typeof this.array !== 'boolean') throw new TypeError(`[KEY] ${this} - Parameter array must be a boolean.`);
		// Default value checking
		if (this.array === true) {
			if (!Array.isArray(this.default)) throw new TypeError(`[DEFAULT] ${this} - Default key must be an array if the key stores an array.`);
		} else if (this.type === 'boolean' && typeof this.default !== 'boolean') {
			throw new TypeError(`[DEFAULT] ${this} - Default key must be a boolean if the key stores a boolean.`);
		} else if (this.type === 'string' && typeof this.default !== 'string' && this.default !== null) {
			throw new TypeError(`[DEFAULT] ${this} - Default key must be either a string or null if the key stores a string.`);
		} else if (this.type !== 'any' && typeof this.default === 'object' && this.default !== null) {
			throw new TypeError(`[DEFAULT] ${this} - Default key must not be type of object unless it is type any or null.`);
		}
		// Min and max checking
		if (this.min !== null && !isNumber(this.min)) throw new TypeError(`[KEY] ${this} - Parameter min must be a number or null.`);
		if (this.max !== null && !isNumber(this.max)) throw new TypeError(`[KEY] ${this} - Parameter max must be a number or null.`);
		if (this.min !== null && this.max !== null && this.min > this.max) throw new TypeError(`[KEY] ${this} - Parameter min must contain a value lower than the parameter max.`);
		// Configurable checking
		if (typeof this.configurable !== 'boolean') throw new TypeError(`[KEY] ${this} - Parameter configurable must be a boolean.`);

		this.sql.push(options.sql || ((this.type === 'integer' || this.type === 'float' ? 'INTEGER' :
			this.max !== null ? `VARCHAR(${this.max})` : 'TEXT') + (this.default !== null ? ` DEFAULT ${SchemaPiece._parseSQLValue(this.default)}` : '')));
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
