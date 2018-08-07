/**
 * The base SchemaType class for all other types
 * @since 0.5.0
 * @private
 */
class SchemaType {

	constructor(types) {
		/**
		 * The SchemaTypes storage containing this type.
		 * @type {SchemaTypes}
		 * @readonly
		 */
		Object.defineProperty(this, 'types', { value: types });
	}

	/**
	 * Resolves data
	 * @param {*} data the data to resolve
	 * @returns {*}
	 */
	async resolve(data) {
		return data;
	}

	/**
	 * The client instance
	 * @returns {KlasaClient}
	 */
	get client() {
		return this.types.client;
	}

	/**
	 * Checks min and max values
	 * @since 0.5.0
	 * @param {KlasaClient} client The client of this bot
	 * @param {number} value The value to check against
	 * @param {external:Guild} guild The guild to use for this check
	 * @param {SchemaPiece} piece The SchemaPiece to use to validate this check
	 * @param {string} suffix An error suffix
	 * @returns {boolean}
	 * @private
	 */
	static minOrMax(client, value, guild, { min, max, key }, suffix) {
		suffix = suffix ? (guild ? guild.language : client.languages.default).get(suffix) : '';
		if (min !== null && max !== null) {
			if (value >= min && value <= max) return true;
			if (min === max) throw (guild ? guild.language : client.languages.default).get('RESOLVER_MINMAX_EXACTLY', key, min, suffix);
			throw (guild ? guild.language : client.languages.default).get('RESOLVER_MINMAX_BOTH', key, min, max, suffix);
		} else if (min !== null) {
			if (value >= min) return true;
			throw (guild ? guild.language : client.languages.default).get('RESOLVER_MINMAX_MIN', key, min, suffix);
		} else if (max !== null) {
			if (value <= max) return true;
			throw (guild ? guild.language : client.languages.default).get('RESOLVER_MINMAX_MAX', key, max, suffix);
		}
		return true;
	}

}

/**
 * Standard regular expressions for matching mentions and snowflake ids
 * @since 0.5.0
 * @type {Object}
 * @property {RegExp} userOrMember Regex for users or members
 * @property {RegExp} channel Regex for channels
 * @property {RegExp} emoji Regex for custom emojis
 * @property {RegExp} role Regex for roles
 * @property {RegExp} snowflake Regex for simple snowflake ids
 * @static
 */
SchemaType.regex = {
	userOrMember: /^(?:<@!?)?(\d{17,19})>?$/,
	channel: /^(?:<#)?(\d{17,19})>?$/,
	emoji: /^(?:<a?:\w{2,32}:)?(\d{17,19})>?$/,
	role: /^(?:<@&)?(\d{17,19})>?$/,
	snowflake: /^(\d{17,19})$/
};

module.exports = SchemaType;
