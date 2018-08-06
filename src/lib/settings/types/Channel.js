const Type = require('./Type');
const { Channel } = require('discord.js');

module.exports = class extends Type {

	async resolve(data, piece, guild) {
		if (data instanceof Channel) return this.checkChannel(data, piece, guild);
		const channel = this.constructor.regex.channel.test(data) ? this.client.channels.get(this.constructor.regex.channel.exec(data)[1]) : null;
		if (channel) return this.checkChannel(data, piece, guild);
		throw (guild ? guild.languauge : this.client.languages.default).get('RESOLVER_INVALID_CHANNEL', piece.key);
	}

	checkChannel(data, piece, guild) {
		const type = piece.type.toLowerCase();
		switch (type) {
			case 'channel': return data.id;
			case 'textchannel':
				if (data.type === 'text') return data.id;
				throw (guild ? guild.languauge : this.client.languages.default).get('RESOLVER_INVALID_CHANNEL', piece.key);
			case 'voicechannel':
				if (data.type === 'voice') return data.id;
				throw (guild ? guild.languauge : this.client.languages.default).get('RESOLVER_INVALID_CHANNEL', piece.key);
			case 'categorychannel':
				if (data.type === 'category') return data.id;
				throw (guild ? guild.languauge : this.client.languages.default).get('RESOLVER_INVALID_CHANNEL', piece.key);
		}
		return null;
	}

};
