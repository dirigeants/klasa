const SchemaType = require('./SchemaType');
const { Role } = require('discord.js');

/**
 * class that resolves roles
 * @extends SchemaType
 * @since 0.5.0
 * @private
 */
class RoleType extends SchemaType {

	/**
	 * Resolves our data into a role
	 * @since 0.5.0
	 * @param {KlasaClient} client The KlasaClient
	 * @param {*} data The data to resolve
	 * @param {SchemaPiece} piece The piece this data should be resolving to
	 * @param {?external:Guild} guild The Guild instance that should be used for this piece
	 * @returns {*} The resolved data
	 */
	async resolve(client, data, piece, guild) {
		if (!guild) throw client.languages.default.get('RESOLVER_INVALID_GUILD', piece.key);
		if (data instanceof Role) return data.id;
		const role = this.constructor.regex.role.test(data) ? guild.roles.get(data) : guild.roles.find(rol => rol.name === data) || null;
		if (role) return role.id;
		throw (guild ? guild.language : client.languages.default).get('RESOLVER_INVALID_ROLE', piece.key);
	}

}

module.exports = RoleType;
