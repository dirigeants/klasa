const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			guarded: true,
			description: (message) => message.language.get('COMMAND_PING_DESCRIPTION')
		});
	}

	async run(message) {
		const msg = message.responses[0] ?
			await message.responses[0].edit(message.language.get('COMMAND_PING')) :
			await message.sendLocale('COMMAND_PING');

		return message.sendLocale('COMMAND_PINGPONG', [(msg.editedTimestamp || msg.createdTimestamp) - (message.editedTimestamp || message.createdTimestamp), Math.round(this.client.ping)]);
	}

};
