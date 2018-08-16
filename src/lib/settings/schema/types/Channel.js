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
	 * @param {Language} language The language to throw from
	 * @param {?external:Guild} guild The Guild instance that should be used for this piece
	 * @returns {*} The resolved data
	 */
	async resolve(data, piece, language, guild) {
		if (data instanceof Channel) return this.checkChannel(data, piece, language);
		const channel = this.constructor.regex.channel.test(data) ? (guild || this.client).channels.get(this.constructor.regex.channel.exec(data)[1]) : null;
		if (channel) return this.checkChannel(channel, piece, language);
		throw language.get('RESOLVER_INVALID_CHANNEL', piece.key);
	}

	deserialize(data, piece, guild) {
		return Promise.resolve((guild || this.client).channels.get(data) || null);
	}

	/**
	 * Checks what kind of channel we should resolve into
	 * @since 0.5.0
	 * @param {*} data The data to resolve
	 * @param {SchemaPiece} piece The piece this data should be resolving to
	 * @param {Language} language The language to throw from
	 * @returns {*} The resolved data
	 */
	checkChannel(data, piece, language) {
		if (
			piece.type === 'channel' ||
			(piece.type === 'textchannel' && data.type === 'text') ||
			(piece.type === 'voicechannel' && data.type === 'voice') ||
			(piece.type === 'categorychannel' && data.type === 'category')
		) return data;
		throw language.get('RESOLVER_INVALID_CHANNEL', piece.key);
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
