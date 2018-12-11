const AliasPiece = require('./base/AliasPiece');
const { MENTION_REGEX } = require('../util/constants');

/**
 * Base class for all Klasa Serializers. See {@tutorial CreatingSerializers} for more information how to use this class
 * to build custom serializers.
 * @tutorial CreatingSerializers
 * @extends AliasPiece
 */
class Serializer extends AliasPiece {

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
	 * @param {SchemaEntry} entry The SchemaEntry we are deserializing for.
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

	static minOrMax(value, { min, max, inclusive, name }, language) {
		if (min && max) {
			if ((value >= min && value <= max && inclusive) || (value > min && value < max && !inclusive)) return true;
			if (min === max) throw language.get('RESOLVER_MINMAX_EXACTLY', name, min, inclusive);
			throw language.get('RESOLVER_MINMAX_BOTH', name, min, max, inclusive);
		} else if (min) {
			if ((value >= min && inclusive) || (value > min && !inclusive)) return true;
			throw language.get('RESOLVER_MINMAX_MIN', name, min, inclusive);
		} else if (max) {
			if ((value <= max && inclusive) || (value < max && !inclusive)) return true;
			throw language.get('RESOLVER_MINMAX_MAX', name, max, inclusive);
		}
		return true;
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
