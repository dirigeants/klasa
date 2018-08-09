const SchemaType = require('./SchemaType');

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
	 * @param {SchemaPiece} piece The piece this data should be resolving to
	 * @param {?external:Guild} guild The Guild instance that should be used for this piece
	 * @returns {*} The resolved data
	 */
	async resolve(data) {
		return String(data);
	}

}

module.exports = StringType;
