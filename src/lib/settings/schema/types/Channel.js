const SchemaType = require('./base/SchemaType');
const { Channel } = require('discord.js');

/**
 * class that resolves channels
 * @extends SchemaType
 * @since 0.5.0
 * @private
 */
class ChannelType extends SchemaType {

	/**
	 * Resolves our data into a channel
	 * @since 0.5.0
	 * @param {*} data The data to resolve
	 * @param {SchemaPiece} piece The piece this data should be resolving to
	 * @param {?external:Guild} guild The Guild instance that should be used for this piece
	 * @returns {*} The resolved data
	 */
	async resolve(data, piece, guild) {
		if (data instanceof Channel) return this.checkChannel(this.client, data, piece, guild);
		const channel = this.constructor.regex.channel.test(data) ? this.client.channels.get(this.constructor.regex.channel.exec(data)[1]) : null;
		if (channel) return this.checkChannel(data, piece, guild);
		throw (guild ? guild.language : this.client.languages.default).get('RESOLVER_INVALID_CHANNEL', piece.key);
	}

	/**
	 * Checks what kind of channel we should resolve into
	 * @since 0.5.0
	 * @param {*} data The data to resolve
	 * @param {SchemaPiece} piece The piece this data should be resolving to
	 * @param {?external:Guild} guild The Guild instance that should be used for this piece
	 * @returns {*} The resolved data
	 */
	checkChannel(data, piece, guild) {
		const type = piece.type.toLowerCase();
		if (
			type === 'channel' ||
			(type === 'textchannel' && data.type === 'text') ||
			(type === 'voicechannel' && data.type === 'voice') ||
			(type === 'categorychannel' && data.type === 'category')
		) return data.id;
		throw (guild ? guild.language : this.client.languages.default).get('RESOLVER_INVALID_CHANNEL', piece.key);
	}

	/**
	 * Resolves a string
	 * @param {*} value the value to resolve
	 * @param {KlasaMessage} message the message to help resolve with
	 * @returns {string}
	 */
	resolveString(value, message) {
		return (message.guild.channels.get(value) || { name: (value && value.name) || value }).name;
	}

}

module.exports = ChannelType;
