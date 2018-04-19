const { Argument } = require('klasa');

module.exports = class extends Argument {

	constructor(...args) {
		super(...args, { aliases: ['mention'] });
	}

	async run(arg, possible, msg) {
		let user = this.client.users.resolve(arg);
		if (user) return user;
		if (this.client.user.bot && this.constructor.regex.userOrMember.test(arg)) user = await this.client.users.fetch(this.constructor.regex.userOrMember.exec(arg)[1]).catch(() => null);
		if (user) return user;
		throw (msg.language || this.client.languages.default).get('RESOLVER_INVALID_USER', possible.name);
	}

};
