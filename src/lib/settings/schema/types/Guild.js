const SchemaType = require('./base/SchemaType');
const { Guild } = require('discord.js');

/**
 * class that resolves guilds
 * @extends SchemaType
 * @since 0.5.0
 * @private
 */
class GuildType extends SchemaType {

	/**
	 * Resolves our data into a guild
	 * @since 0.5.0
	 * @param {*} data The data to resolve
	 * @param {SchemaPiece} piece The piece this data should be resolving to
	 * @param {Language} language The language to throw from
	 * @returns {*} The resolved data
	 */
	async resolve(data, piece, language) {
		if (data instanceof Guild) return data.id;
		const guild = this.constructor.regex.snowflake.test(data) ? this.client.guilds.get(data) : null;
		if (guild) return guild.id;
		throw language.get('RESOLVER_INVALID_GUILD', piece.key);
	}

	/**
	 * Resolves a string
	 * @param {*} value the value to resolve
	 * @returns {string}
	 */
	resolveString(value) {
		return (value && value.name) || value;
	}

}

module.exports = GuildType;
