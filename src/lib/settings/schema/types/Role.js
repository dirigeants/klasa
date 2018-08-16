const SchemaType = require('./base/SchemaType');
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
	 * @param {*} data The data to resolve
	 * @param {SchemaPiece} piece The piece this data should be resolving to
	 * @param {Language} language The language to throw from
	 * @param {external:Guild} guild The guild to use for this resolver
	 * @returns {*} The resolved data
	 */
	async resolve(data, piece, language, guild) {
		if (!guild) throw this.client.languages.default.get('RESOLVER_INVALID_GUILD', piece.key);
		if (data instanceof Role) return data;
		const role = this.constructor.regex.role.test(data) ? guild.roles.get(data) : guild.roles.find(rol => rol.name === data) || null;
		if (role) return role;
		throw language.get('RESOLVER_INVALID_ROLE', piece.key);
	}

	deserialize(data, piece, guild) {
		return Promise.resolve((guild && guild.roles.get(data)) || null);
	}

	/**
	 * Resolves a string
	 * @param {*} value the value to resolve
	 * @param {KlasaMessage} message the message to help resolve with
	 * @returns {string}
	 */
	resolveString(value, message) {
		return (message.guild.roles.get(value) || { name: (value && value.name) || value }).name;
	}

}

module.exports = RoleType;
