const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['details', 'what'],
			description: 'Provides some information about this bot.'
		});
	}

	async run(msg) {
		return msg.sendMessage(msg.language.get('COMMAND_INFO'));
	}

};
