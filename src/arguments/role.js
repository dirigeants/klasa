const { Argument } = require('klasa');

module.exports = class extends Argument {

	run(arg, possible, msg) {
		const role = this.constructor.regex.role.test(arg) ? msg.guild.roles.get(this.constructor.regex.role.exec(arg)[1]) : null;
		if (role) return role;
		throw (msg.language || this.client.languages.default).get('RESOLVER_INVALID_ROLE', possible.name);
	}

};
