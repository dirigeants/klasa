const Piece = require('./base/Piece');
const { aliasPiece } = require('./base/AliasPiece');
const { MENTION_REGEX } = require('../util/constants');

/**
 * Base class for all Klasa Serializers. See {@tutorial CreatingSerializers} for more information how to use this class
 * to build custom serializers.
 * @tutorial CreatingSerializers
 * @extends Piece
 */
class Serializer extends Piece {

	/**
	 * @param {KlasaClient} client The Klasa client
	 * @param {SerializerStore} store The Serializer Store
	 * @param {string} file The path from the pieces folder to the serializer file
	 * @param {boolean} core If the piece is in the core directory or not
	 * @param {AliasPieceOptions} [options={}] Optional Serializer settings
	 */
	constructor(client, store, file, core, options = {}) {
		super(client, store, file, core, options);

		aliasPiece(this, options);
	}

	/**
	 * The serialize method to be overwritten in actual Serializers
	 * @since 0.5.0
	 * @param {*} data The data to serialize
	 * @returns {string|number|boolean}
	 */
	serialize(data) {
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
	async deserialize() {
		throw new Error(`The deserialize method has not been implemented by ${this.type}:${this.name}`);
	}

	/**
	 * The stringify method to be overwritten in actual Serializers
	 * @since 0.5.0
	 * @param {*} data The data to stringify
	 * @returns {string}
	 */
	stringify(data) {
		return String(data);
	}

}

/**
 * Standard regular expressions for matching mentions and snowflake ids
 * @since 0.5.0
 * @type {Object<string,RegExp>}
 * @property {RegExp} userOrMember Regex for users or members
 * @property {RegExp} channel Regex for channels
 * @property {RegExp} emoji Regex for custom emojis
 * @property {RegExp} role Regex for roles
 * @property {RegExp} snowflake Regex for simple snowflake ids
 * @static
 */
Serializer.regex = MENTION_REGEX;

module.exports = Serializer;
