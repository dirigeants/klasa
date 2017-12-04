const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['details', 'what'],
			guarded: true,
			description: (msg) => msg.language.get('COMMAND_INFO_DESCRIPTION')
		});
	}

	async run(msg) {
		return msg.sendMessage(msg.language.get('COMMAND_INFO'));
	}

};
