const SchemaType = require('./SchemaType');

/**
 * Class that resolves commands
 * @extends SchemaType
 * @since 0.5.0
 * @private
 */
class CommandType extends SchemaType {

	/**
	 * Resolves our data into a command
	 * @since 0.5.0
	 * @param {*} data The data to resolve
	 * @param {SchemaPiece} piece The piece this data should be resolving to
	 * @param {?external:Guild} guild The Guild instance that should be used for this piece
	 * @returns {*} The resolved data
	 */
	async resolve(data, piece, guild) {
		const command = this.client.commands.get(data.toLowerCase());
		if (command) return command.name;
		throw (guild ? guild.language : this.client.languages.default).get('RESOLVER_INVALID_PIECE', piece.key, 'command');
	}

}

module.exports = CommandType;
