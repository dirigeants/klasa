const Type = require('./Type');
const { Channel } = require('discord.js');

module.exports = class extends Type {

	async resolve(data, piece, message) {
		if (data instanceof Channel) return this.checkChannel(data, piece, message);
		const channel = this.constructor.regex.channel.test(data) ? this.client.channels.get(this.constructor.regex.channel.exec(data)[1]) : null;
		if (channel) return this.checkChannel(data, piece, message);
		throw (message ? message.languauge : this.client.languages.default).get('RESOLVER_INVALID_CHANNEL', piece.key);
	}

	checkChannel(data, piece, message) {
		const type = piece.type.toLowerCase();
		switch (type) {
			case 'channel': return data.id;
			case 'textchannel':
				if (data.type === 'text') return data.id;
				throw (message ? message.languauge : this.client.languages.default).get('RESOLVER_INVALID_CHANNEL', piece.key);
			case 'voicechannel':
				if (data.type === 'voice') return data.id;
				throw (message ? message.languauge : this.client.languages.default).get('RESOLVER_INVALID_CHANNEL', piece.key);
			case 'categorychannel':
				if (data.type === 'category') return data.id;
				throw (message ? message.languauge : this.client.languages.default).get('RESOLVER_INVALID_CHANNEL', piece.key);
		}
		return null;
	}

};
