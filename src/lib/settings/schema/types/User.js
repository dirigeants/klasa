const SchemaType = require('./base/SchemaType');

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
	 * @param {*} data The data to resolve
	 * @param {SchemaPiece} piece The piece this data should be resolving to
	 * @param {Language} language The language to throw from
	 * @returns {*} The resolved data
	 */
	async resolve(data, piece, language) {
		let user = this.client.users.resolve(data);
		if (user) return user;
		if (this.constructor.regex.userOrMember.test(data)) user = await this.client.users.fetch(this.constructor.regex.userOrMember.exec(data)[1]).catch(() => null);
		if (user) return user;
		throw language.get('RESOLVER_INVALID_USER', piece.key);
	}

	deserialize(data) {
		return this.client.users.fetch(data).catch(() => null);
	}

	/**
	 * Resolves a string
	 * @param {*} value the value to resolve
	 * @returns {string}
	 */
	resolveString(value) {
		return (this.client.users.get(value) || { username: (value && value.username) || value }).username;
	}

}

module.exports = UserType;
