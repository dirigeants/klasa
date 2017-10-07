const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			description: 'Displays the join server link of the bot.'
		});
	}

	async run(msg) {
		if (!this.client.user.bot) return msg.reply(await msg.fetchLanguageCode('COMMAND_INVITE_SELFBOT'));

		return msg.sendMessage(await msg.fetchLanguageCode('COMMAND_INVITE', this.client));
	}

};
