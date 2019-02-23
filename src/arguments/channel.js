const { Argument } = require('klasa');

module.exports = class extends Argument {

	async run(arg, possible, message) {
		// DM Channel support
		const user = this.constructor.regex.userOrMember.test(arg) ? await this.client.users.fetch(this.constructor.regex.userOrMember.exec(arg)[1]) : null;
		if (user) return user.createDM();
		// Regular Channel support
		const channel = this.constructor.regex.channel.test(arg) ? await this.client.channels.fetch(this.constructor.regex.channel.exec(arg)[1]) : null;
		if (channel) return channel;
		throw message.language.get('RESOLVER_INVALID_CHANNEL', possible.name);
	}

};
