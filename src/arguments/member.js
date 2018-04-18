const { Argument } = require('klasa');

module.exports = class extends Argument {

	async run(arg, possible, msg) {
		let member = msg.guild.members.resolve(arg);
		if (member) return member;
		if (this.client.user.bot && this.constructor.regex.userOrMember.test(arg)) {
			const user = await this.client.users.fetch(this.constructor.regex.userOrMember.exec(arg)[1]).catch(() => null);
			if (user) {
				member = msg.guild.members.fetch(user).catch(() => null);
				if (member) return member;
			}
		}
		throw (msg.language || this.client.languages.default).get('RESOLVER_INVALID_MEMBER', possible.name);
	}

};
