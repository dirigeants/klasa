const Type = require('./Type');
const { Role } = require('discord.js');

/**
	* class that resolves roles
  * @extends SchemaType
	* @since 0.5.0
	* @private
	*/
class RoleType extends Type {

	/**
	  * Resolves our data into a role
	  * @since 0.5.0
		* @param {*} data The data to resolve
		* @param {SchemaPiece} piece The piece this data should be resolving to
		* @param {?external:Guild} guild The Guild instance that should be used for this piece
		* @returns {*} The resolved data
		*/
	async resolve(data, piece, guild) {
		if (!guild) throw this.client.languages.default.get('RESOLVER_INVALID_GUILD', piece.key);
		if (data instanceof Role) return data.id;
		const role = this.constructor.regex.role.test(data) ? guild.roles.get(data) : guild.roles.find(rol => rol.name === data) || null;
		if (role) return role.id;
		throw (guild ? guild.languauge : this.client.languages.default).get('RESOLVER_INVALID_ROLE', piece.key);
	}

}

module.exports = RoleType;
