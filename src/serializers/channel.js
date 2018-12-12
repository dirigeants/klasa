const { Serializer } = require('klasa');
const { Channel } = require('discord.js');

module.exports = class extends Serializer {

	constructor(...args) {
		super(...args, { aliases: ['textchannel', 'voicechannel', 'categorychannel'] });
	}

	checkChannel(data, entry, language) {
		if (
			entry.type === 'channel' ||
			(entry.type === 'textchannel' && data.type === 'text') ||
			(entry.type === 'voicechannel' && data.type === 'voice') ||
			(entry.type === 'categorychannel' && data.type === 'category')
		) return data;
		throw language.get('RESOLVER_INVALID_CHANNEL', entry.key);
	}

	async deserialize(data, entry, language, guild) {
		if (data instanceof Channel) return this.checkChannel(data, entry, language);
		const channel = this.constructor.regex.channel.test(data) ? (guild || this.client).channels.get(this.constructor.regex.channel.exec(data)[1]) : null;
		if (channel) return this.checkChannel(channel, entry, language);
		throw language.get('RESOLVER_INVALID_CHANNEL', entry.key);
	}

	serialize(value) {
		return value.id;
	}

	stringify(value, message) {
		return (message.guild.channels.get(value) || { name: (value && value.name) || value }).name;
	}

};
