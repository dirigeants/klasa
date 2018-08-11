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
	 * @param {KlasaClient} client The KlasaClient
	 * @param {*} data The data to resolve
	 * @param {SchemaPiece} piece The piece this data should be resolving to
	 * @param {?external:Guild} guild The Guild instance that should be used for this piece
	 * @returns {*} The resolved data
	 */
	async resolve(client, data, piece, guild) {
		if (data instanceof Guild) return data.id;
		const guil = this.constructor.regex.snowflake.test(data) ? client.guilds.get(data) : null;
		if (guil) return guil.id;
		throw (guild ? guild.language : client.languages.default).get('RESOLVER_INVALID_GUILD', piece.key);
	}

}

module.exports = GuildType;
