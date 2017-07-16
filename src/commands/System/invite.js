const { Command, util } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, 'invite', {
			runIn: ['text'],
			description: 'Displays the join server link of the bot.'
		});
	}

	async run(msg) {
		if (!this.client.user.bot) return msg.reply('Why would you need an invite link for a selfbot...');

		return msg.sendMessage([
			`To add ${this.client.user.username} to your discord guild:`,
			this.client.invite,
			util.codeBlock('', [
				'The above link is generated requesting the minimum permissions required to use every command currently.',
				"I know not all permissions are right for every server, so don't be afraid to uncheck any of the boxes.",
				'If you try to use a command that requires more permissions than the bot is granted, it will let you know.'
			].join(' ')),
			'Please file an issue at <https://github.com/dirigeants/klasa> if you find any bugs.'
		]);
	}

};
