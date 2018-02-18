const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['u'],
			permLevel: 10,
			guarded: true,
			description: (msg) => msg.language.get('COMMAND_UNLOAD_DESCRIPTION'),
			usage: '<Piece:piece>'
		});
	}

	async run(msg, [piece]) {
		piece.unload();
		if (this.client.shard) {
			await this.client.shard.broadcastEval(`
				if (this.shard.id !== ${this.client.shard.id}) this.${piece.store}.get('${piece.name}').unload();
			`);
		}
		return msg.sendMessage(msg.language.get('COMMAND_UNLOAD', piece.type, piece.name));
	}

};
