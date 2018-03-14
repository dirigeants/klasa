const { Command } = require('klasa');
const fs = require('fs-nextra');
const { resolve, join } = require('path');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			permLevel: 10,
			guarded: true,
			description: (msg) => msg.language.get('COMMAND_TRANSFER_DESCRIPTION'),
			usage: '<Piece:piece>'
		});
	}

	async run(msg, [piece]) {
		const file = join(...piece.file);
		const fileLocation = resolve(piece.store.coreDir, file);
		await fs.access(fileLocation).catch(() => { throw msg.language.get('COMMAND_TRANSFER_ERROR'); });
		try {
			await fs.copy(fileLocation, join(piece.store.userDir, file));

			if (this.client.shard) await this.client.shard.broadcastEval(client => client.pieceStores.get(piece.store.name).load(piece.file));
			else piece.store.load(piece.file);

			return msg.sendMessage(msg.language.get('COMMAND_TRANSFER_SUCCESS', piece.type, piece.name));
		} catch (err) {
			this.client.emit('error', err.stack);
			return msg.sendMessage(msg.language.get('COMMAND_TRANSFER_FAILED', piece.type, piece.name));
		}
	}

};
