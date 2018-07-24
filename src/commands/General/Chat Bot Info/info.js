const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['details', 'what'],
			guarded: true,
			description: (message) => message.language.get('COMMAND_INFO_DESCRIPTION')
		});
	}

	async run(message) {
		return message.sendLocale('COMMAND_INFO');
	}

};
