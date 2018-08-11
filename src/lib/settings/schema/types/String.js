const SchemaType = require('./base/SchemaType');

/**
 * class that resolves strings
 * @extends SchemaType
 * @since 0.5.0
 * @private
 */
class StringType extends SchemaType {

	/**
	 * Resolves our data into a string
	 * @since 0.5.0
	 * @param {*} data The data to resolve
	 * @returns {*} The resolved data
	 */
	async resolve(data) {
		return String(data);
	}

}

module.exports = StringType;
