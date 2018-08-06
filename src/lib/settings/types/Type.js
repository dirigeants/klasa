/**
  * The base SchemaType class for all other types
	* @since 0.5.0
	* @private
	*/
class SchemaType {

	constructor(types) {
		Object.defineProperty(this, 'types', { value: types });
	}

	// Come back here and add documentation for this class after discussing what to do when a type is used that is not found in storage.
	resolve(data) {
		return Promise.resolve(data);
	}

	get client() {
		return this.types.client;
	}

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
