/**
 * The base SchemaType class for all other types
 * @since 0.5.0
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
	 * The current KlasaClient
	 * @since 0.5.0
	 * @type {KlasaClient}
	 * @readonly
	 */
	get client() {
		return this.types.client;
	}

	/**
	 * Resolves data
	 * @param {*} data the data to resolve
	 * @param {SchemaPiece} piece The SchemaPiece instance that manages this data
	 * @param {Language} language The language to throw from
	 * @param {KlasaGuild} [guild] The guild for context in resolve
	 * @returns {*}
	 * @abstract
	 */
	async resolve(data) {
		return data;
	}

	serialize(data) {
		return data;
	}

	deserialize(data) {
		return data;
	}

	/**
	 * Resolves a string
	 * @param {*} value the value to resolve
	 * @returns {string}
	 * @abstract
	 */
	resolveString(value) {
		return String(value);
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
