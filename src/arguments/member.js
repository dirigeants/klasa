const { Argument } = require('klasa');

module.exports = class extends Argument {

	async run(arg, possible, message) {
		let member = message.guild.members.resolve(arg);
		if (member) return member;
		if (this.constructor.regex.userOrMember.test(arg)) {
			const user = await this.client.users.fetch(this.constructor.regex.userOrMember.exec(arg)[1]).catch(() => null);
			if (user) {
				member = await message.guild.members.fetch(user).catch(() => null);
				if (member) return member;
			}
		}
		throw message.language.get('RESOLVER_INVALID_MEMBER', possible.name);
	}

};
