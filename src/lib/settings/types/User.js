const SchemaType = require('./SchemaType');

/**
 * class that resolves users
 * @extends SchemaType
 * @since 0.5.0
 * @private
 */
class UserType extends SchemaType {

	/**
	 * Resolves our data into an user
	 * @since 0.5.0
	 * @param {KlasaClient} client The KlasaClient
	 * @param {*} data The data to resolve
	 * @param {SchemaPiece} piece The piece this data should be resolving to
	 * @param {?external:Guild} guild The Guild instance that should be used for this piece
	 * @returns {*} The resolved data
	 */
	async resolve(client, data, piece, guild) {
		let user = client.users.resolve(data);
		if (user) return user.id;
		if (this.constructor.regex.userOrMember.test(data)) user = await client.users.fetch(this.constructor.regex.userOrMember.exec(data)[1]).catch(() => null);
		if (user) return user.id;
		throw (guild ? guild.languauge : client.languages.default).get('RESOLVER_INVALID_USER', piece.key);
	}

}

module.exports = UserType;
