const Piece = require('./base/Piece');

/**
 * Base class for all Klasa Serializers. See {@tutorial CreatingSerializers} for more information how to use this class
 * to build custom serializers.
 * @tutorial CreatingSerializers
 * @extends Piece
 */
class Serializer extends Piece {

	/**
	 * @typedef {PieceOptions} SerializerOptions
	 * @property {string[]} [aliases=[]] Any serializer aliases
	 */

	/**
	 * @since 0.5.0
	 * @param {KlasaClient} client The Klasa Client
	 * @param {SerializereStore} store The Serializer store
	 * @param {Array} file The path from the pieces folder to the serializer file
	 * @param {boolean} core If the piece is in the core directory or not
	 * @param {SerializerOptions} [options={}] Optional serializer settings
	 */
	constructor(client, store, file, core, options = {}) {
		super(client, store, file, core, options);

		/**
	 	 * The aliases for this serializer
	 	 * @since 0.5.0
	 	 * @type {string[]}
	 	 */
		this.aliases = options.aliases;
	}


	/**
	 * The serialize method to be overwritten in actual Serializers
	 * @since 0.5.0
	 * @param {*} data The data to serialize

	 */
	async serialize(data) {
		return data;
	}

	/**
	 * The deserialize method to be overwritten in actual Serializers
	 * @since 0.5.0
	 * @param {*} data The data to deserialize
	 * @param {SchemaPiece} piece The SchemaPiece we are deserializing for.
	 * @param {Language} language The language to use when responding.
	 * @param {external:Guild} [guild] The guild that will help deserialize
	 * @returns {*}
	 * @abstract
	 */
	deserialize() {
		throw new Error(`The deserialize method has not been implemented by ${this.type}:${this.name}`);
	}

	/**
	 * The stringify method to be overwritten in actual Serializers
	 * @since 0.5.0
	 * @param {*} data The data to stringify
	 * @returns {*}
	 */
	stringify(data) {
		return data;
	}

	/**
	 * Defines the JSON.stringify behavior of this serializer.
	 * @since 0.5.0
	 * @returns {Object}
	 */
	toJSON() {
		return {
			...super.toJSON(),
			aliases: this.aliases.slice(0)
		};
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
Serializer.regex = {
	userOrMember: /^(?:<@!?)?(\d{17,19})>?$/,
	channel: /^(?:<#)?(\d{17,19})>?$/,
	emoji: /^(?:<a?:\w{2,32}:)?(\d{17,19})>?$/,
	role: /^(?:<@&)?(\d{17,19})>?$/,
	snowflake: /^(\d{17,19})$/
};

module.exports = Serializer;
