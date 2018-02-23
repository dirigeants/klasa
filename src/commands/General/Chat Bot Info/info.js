const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['details', 'what'],
			guarded: true,
			description: (msg) => msg.language.get('COMMAND_INFO_DESCRIPTION'),
			sendReturn: true
		});
	}

	async run(msg) {
		return msg.language.get('COMMAND_INFO');
	}

};
