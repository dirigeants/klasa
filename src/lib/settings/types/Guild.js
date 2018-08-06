const Type = require('./Type');
const { Guild } = require('discord.js');

module.exports = class extends Type {

	async resolve(data, piece, guild) {
		if (data instanceof Guild) return data.id;
		const guil = this.constructor.regex.snowflake.test(data) ? this.client.guilds.get(data) : null;
		if (guil) return guil.id;
		throw (guild ? guild.languauge : this.client.languages.default).get('RESOLVER_INVALID_GUILD', piece.key);
	}

};
