const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			guarded: true,
			description: (message) => message.language.get('COMMAND_INVITE_DESCRIPTION')
		});
	}

	async run(message) {
		if (!this.client.user.bot) return message.reply(message.language.get('COMMAND_INVITE_SELFBOT'));

		return message.sendMessage(message.language.get('COMMAND_INVITE', this.client));
	}

	async init() {
		if (this.client.application && !this.client.application.botPublic) this.permissionLevel = 10;
	}

};
