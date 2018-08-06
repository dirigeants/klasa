const Type = require('./Type');


/**
	* class that resolves booleans
  * @extends SchemaType
	* @since 0.5.0
	* @private
	*/
class BooleanType extends Type {


	/**
	  * Resolves our data into a boolean
	  * @since 0.5.0
		* @param {*} data The data to resolve
		* @param {SchemaPiece} piece The piece this data should be resolving to
		* @param {?external:Guild} guild The Guild instance that should be used for this piece
		* @returns {*} The resolved data
		*/
	async resolve(data, piece, guild) {
		if (typeof data === 'boolean') return data;
		let bool = String(data).toLowerCase();
		if (['1', 'true', '+', 't', 'yes', 'y'].includes(bool)) bool = true;
		if (['0', 'false', '-', 'f', 'no', 'n'].includes(bool)) bool = false;
		if (typeof bool === 'boolean') return bool;
		throw (guild ? guild.languauge : this.client.languages.default).get('RESOLVER_INVALID_BOOL', piece.key);
	}

}

module.exports = BooleanType;
