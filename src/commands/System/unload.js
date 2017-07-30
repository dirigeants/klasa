const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['u'],
			permLevel: 10,
			description: 'Unloads the klasa piece.',
			usage: '<Inhibitor:inhibitor|Extendable:extendable|Finalizer:finalizer|Monitor:monitor|Provider:provider|Event:event|Command:cmd>'
		});
	}

	async run(msg, [piece]) {
		piece.unload();
		return msg.sendMessage(`✅ Unloaded ${piece.type}: ${piece.name}`);
	}

};
