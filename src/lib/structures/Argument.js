const Piece = require('./base/Piece');

/**
 * Base class for all Klasa Arguments. See {@tutorial CreatingArguments} for more information how to use this class
 * to build custom arguments.
 * @tutorial CreatingArguments
 * @extends Piece
 */
class Argument extends Piece {

	/**
	 * @typedef {PieceOptions} ArgumentOptions
	 * @property {string[]} [aliases=[]] Any argument aliases
	 */

	/**
	 * @since 0.0.1
	 * @param {KlasaClient} client The Klasa Client
	 * @param {ArgumentStore} store The Argument store
	 * @param {Array} file The path from the pieces folder to the argument file
	 * @param {boolean} core If the piece is in the core directory or not
	 * @param {ArgumentOptions} [options={}] Optional Argument settings
	 */
	constructor(client, store, file, core, options = {}) {
		super(client, store, file, core, options);

		/**
		 * The aliases for this argument
		 * @since 0.5.0
		 * @type {string[]}
		 */
		this.aliases = options.aliases;
	}

	/**
	 * The run method to be overwritten in actual Arguments
	 * @since 0.5.0
	 * @param {string} argument The string argument string to resolve
	 * @param {Possible} possible This current usage possible
	 * @param {KlasaMessage} message The message that triggered the command
	 * @abstract
	 */
	async run() {
		// Defined in extension Classes
		throw new Error(`The run method has not been implemented by ${this.type}:${this.name}.`);
	}

	/**
	 * Defines the JSON.stringify behavior of this argument.
	 * @since 0.5.0
	 * @returns {Object}
	 */
	toJSON() {
		return {
			...super.toJSON(),
			aliases: this.aliases.slice(0)
		};
	}

	/**
	 * Checks min and max values
	 * @since 0.5.0
	 * @param {KlasaClient} client The client of this bot
	 * @param {number} value The value to check against
	 * @param {?number} min The minimum value
	 * @param {?number} max The maximum value
	 * @param {Possible} possible The id of the current possible usage
	 * @param {KlasaMessage} msg The message that triggered the command
	 * @param {string} suffix An error suffix
	 * @returns {boolean}
	 * @private
	 */
	static minOrMax(client, value, min = null, max = null, possible, msg, suffix) {
		suffix = suffix ? (msg ? msg.language : client.languages.default).get(suffix) : '';
		if (min !== null && max !== null) {
			if (value >= min && value <= max) return true;
			if (min === max) throw (msg ? msg.language : client.languages.default).get('RESOLVER_MINMAX_EXACTLY', possible.name, min, suffix);
			throw (msg ? msg.language : client.languages.default).get('RESOLVER_MINMAX_BOTH', possible.name, min, max, suffix);
		} else if (min !== null) {
			if (value >= min) return true;
			throw (msg ? msg.language : client.languages.default).get('RESOLVER_MINMAX_MIN', possible.name, min, suffix);
		} else if (max !== null) {
			if (value <= max) return true;
			throw (msg ? msg.language : client.languages.default).get('RESOLVER_MINMAX_MAX', possible.name, max, suffix);
		}
		return true;
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
Argument.regex = {
	userOrMember: /^(?:<@!?)?(\d{17,19})>?$/,
	channel: /^(?:<#)?(\d{17,19})>?$/,
	emoji: /^(?:<a?:\w{2,32}:)?(\d{17,19})>?$/,
	role: /^(?:<@&)?(\d{17,19})>?$/,
	snowflake: /^(\d{17,19})$/
};

module.exports = Argument;
