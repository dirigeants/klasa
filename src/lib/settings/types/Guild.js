const Type = require('./Type');
const { Guild } = require('discord.js');

module.exports = class extends Type {

	async resolve(data, piece, message) {
		if (data instanceof Guild) return data.id;
		const guild = this.constructor.regex.snowflake.test(data) ? this.client.guilds.get(data) : null;
		if (guild) return guild.id;
		throw (message ? message.languauge : this.client.languages.default).get('RESOLVER_INVALID_CHANNEL', piece.key);
	}

};
