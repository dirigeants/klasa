const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			permLevel: 10,
			guarded: true,
			description: (msg) => msg.language.get('COMMAND_DISABLE_DESCRIPTION'),
			usage: '<Piece:piece>'
		});
	}

	async run(msg, [piece]) {
		if ((piece.type === 'event' && piece.name === 'Message') || (piece.type === 'monitor' && piece.name === 'commandHandler')) {
			return msg.sendMessage(msg.language.get('COMMAND_DISABLE_WARN'));
		}
		piece.disable();
		if (this.client.sharded) {
			await this.client.shard.broadcastEval(`
				if (this.shard.id !== ${this.client.shard.id}) this.${piece.type}s.get('${piece.name}').disable();
			`);
		}
		return msg.sendCode('diff', msg.language.get('COMMAND_DISABLE', piece.type, piece.name));
	}

};
