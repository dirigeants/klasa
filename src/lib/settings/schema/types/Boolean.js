const SchemaType = require('./base/SchemaType');
const truths = ['1', 'true', '+', 't', 'yes', 'y'];
const falses = ['0', 'false', '-', 'f', 'no', 'n'];


/**
 * class that resolves booleans
 * @extends SchemaType
 * @since 0.5.0
 * @private
 */
class BooleanType extends SchemaType {

	/**
	 * Resolves our data into a boolean
	 * @since 0.5.0
	 * @param {*} data The data to resolve
	 * @param {SchemaPiece} piece The piece this data should be resolving to
	 * @param {Language} language The language to throw from
	 * @returns {*} The resolved data
	 */
	async resolve(data, piece, language) {
		if (typeof data === 'boolean') return data;
		const bool = String(data).toLowerCase();
		if (truths.includes(bool)) return true;
		if (falses.includes(bool)) return false;
		throw language.get('RESOLVER_INVALID_BOOL', piece.key);
	}

	/**
	 * Resolves a string
	 * @param {*} value the value to resolve
	 * @returns {string}
	 */
	resolveString(value) {
		return value ? 'Enabled' : 'Disabled';
	}

}

module.exports = BooleanType;
