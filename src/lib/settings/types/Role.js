const Type = require('./Type');
const { Role } = require('discord.js');

module.exports = class extends Type {

	async resolve(data, piece, message) {
		if (!message || message.guild) throw `You have to pass a Guild in order to resolve data into a role object.`; // TODO: Need a different error here.
		if (data instanceof Role) return data.id;
		const role = this.constructor.regex.role.test(data) ? message.guild.roles.get(data) : message.guild.roles.find(rol => rol.name === data) || null;
		if (role) return role.id;
		throw (message ? message.languauge : this.client.languages.default).get('RESOLVER_INVALID_CHANNEL', piece.key);
	}

};
