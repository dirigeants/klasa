const SchemaType = require('./SchemaType');
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
	 * @param {KlasaClient} client The KlasaClient
	 * @param {*} data The data to resolve
	 * @param {SchemaPiece} piece The piece this data should be resolving to
	 * @param {?external:Guild} guild The Guild instance that should be used for this piece
	 * @returns {*} The resolved data
	 */
	async resolve(client, data, piece, guild) {
		if (data instanceof Channel) return this.checkChannel(client, data, piece, guild);
		const channel = this.constructor.regex.channel.test(data) ? client.channels.get(this.constructor.regex.channel.exec(data)[1]) : null;
		if (channel) return this.checkChannel(client, data, piece, guild);
		throw (guild ? guild.languauge : client.languages.default).get('RESOLVER_INVALID_CHANNEL', piece.key);
	}

	/**
	 * Checks what kind of channel we should resolve into
	 * @since 0.5.0
	 * @param {KlasaClient} client The KlasaClient
	 * @param {*} data The data to resolve
	 * @param {SchemaPiece} piece The piece this data should be resolving to
	 * @param {?external:Guild} guild The Guild instance that should be used for this piece
	 * @returns {*} The resolved data
	 */
	checkChannel(client, data, piece, guild) {
		const type = piece.type.toLowerCase();
		switch (type) {
			case 'channel': return data.id;
			case 'textchannel':
				if (data.type === 'text') return data.id;
				throw (guild ? guild.languauge : client.languages.default).get('RESOLVER_INVALID_CHANNEL', piece.key);
			case 'voicechannel':
				if (data.type === 'voice') return data.id;
				throw (guild ? guild.languauge : client.languages.default).get('RESOLVER_INVALID_CHANNEL', piece.key);
			case 'categorychannel':
				if (data.type === 'category') return data.id;
				throw (guild ? guild.languauge : client.languages.default).get('RESOLVER_INVALID_CHANNEL', piece.key);
		}
		return null;
	}

}

module.exports = ChannelType;
