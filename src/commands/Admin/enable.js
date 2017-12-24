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
		piece.enable();
		if (this.client.sharded) {
			await this.client.shard.broadcastEval(`
				if (this.shard.id !== ${this.client.shard.id}) this.${piece.type}s.get('${piece.name}').enable();
			`);
		}
		return msg.sendCode('diff', msg.language.get('COMMAND_ENABLE', piece.type, piece.name));
	}

};
