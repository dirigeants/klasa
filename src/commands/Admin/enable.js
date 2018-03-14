const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			permLevel: 10,
			guarded: true,
			description: (msg) => msg.language.get('COMMAND_ENABLE_DESCRIPTION'),
			usage: '<Piece:piece>'
		});
	}

	async run(msg, [piece]) {
		if (this.client.shard) await this.client.shard.broadcastEval(client => client.pieceStores.get(piece.store.name).get(piece.name).enable());
		else piece.enable();

		return msg.sendCode('diff', msg.language.get('COMMAND_ENABLE', piece.type, piece.name));
	}

};
