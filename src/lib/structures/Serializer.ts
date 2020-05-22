import { AliasPiece } from './base/AliasPiece';
import { MENTION_REGEX } from '../util/constants';

/**
 * Base class for all Klasa Serializers. See {@tutorial CreatingSerializers} for more information how to use this class
 * to build custom serializers.
 * @tutorial CreatingSerializers
 * @extends AliasPiece
 */
export class Serializer extends AliasPiece {

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

	/**
	 * Standard regular expressions for matching mentions and snowflake ids
	 * @since 0.5.0
	 */
	public static regex = MENTION_REGEX;

}

