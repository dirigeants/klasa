const { Argument } = require('klasa');

module.exports = class extends Argument {

	constructor(...args) {
		super(...args, { aliases: ['msg'] });
	}

	async run(arg, possible, msg) {
		const message = this.constructor.regex.snowflake.test(arg) ? await msg.channel.messages.fetch(arg).catch(() => null) : undefined;
		if (message) return message;
		throw (msg.language || this.client.languages.default).get('RESOLVER_INVALID_MSG', possible.name);
	}

};
