const { Argument } = require('klasa');

module.exports = class extends Argument {

	run(arg, possible, message) {
		const guild = this.constructor.regex.snowflake.test(arg) ? this.client.guilds.get(arg) : null;
		if (guild) return guild;
		throw (message.language || this.client.languages.default).get('RESOLVER_INVALID_GUILD', possible.name);
	}

};
