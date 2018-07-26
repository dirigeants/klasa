const { Argument } = require('klasa');

module.exports = class extends Argument {

	constructor(...args) {
		super(...args, { aliases: ['mention'] });
	}

	async run(arg, possible, message) {
		let user = this.client.users.resolve(arg);
		if (user) return user;
		if (this.constructor.regex.userOrMember.test(arg)) user = await this.client.users.fetch(this.constructor.regex.userOrMember.exec(arg)[1]).catch(() => null);
		if (user) return user;
		throw (message.language || this.client.languages.default).get('RESOLVER_INVALID_USER', possible.name);
	}

};
