const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['u'],
			permLevel: 10,
			description: 'Unloads the klasa piece.',
			usage: '<Piece:piece>'
		});
	}

	async run(msg, [piece]) {
		piece.unload();
		return msg.sendMessage(await msg.fetchLanguageCode('COMMAND_UNLOAD', piece.type, piece.name));
	}

};
