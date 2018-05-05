const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			guarded: true,
			description: (message) => message.language.get('COMMAND_PING_DESCRIPTION')
		});
	}

	async run(message) {
		const msg = await message.sendMessage(message.language.get('COMMAND_PING'));
		return msg.sendMessage(
			message.language.get('COMMAND_PINGPONG', (message.editedTimestamp || message.createdTimestamp) - (message.editedTimestamp || message.createdTimestamp), Math.round(this.client.ping))
		);
	}

};
