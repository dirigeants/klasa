const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			guarded: true,
			description: (msg) => msg.language.get('COMMAND_INVITE_DESCRIPTION'),
			sendReturn: true
		});
	}

	async run(msg) {
		if (!this.client.user.bot) return msg.reply(msg.language.get('COMMAND_INVITE_SELFBOT'));

		return msg.language.get('COMMAND_INVITE', this.client);
	}

};
