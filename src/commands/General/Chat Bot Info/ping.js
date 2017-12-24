const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			guarded: true,
			description: (msg) => msg.language.get('COMMAND_PING_DESCRIPTION')
		});
	}

	async run(msg) {
		const message = await msg.sendMessage(msg.language.get('COMMAND_PING'));
		return msg.sendMessage(
			msg.language.get('COMMAND_PINGPONG', (message.editedTimestamp || message.createdTimestamp) - (msg.editedTimestamp || msg.createdTimestamp), Math.round(this.client.ping))
		);
	}

};
