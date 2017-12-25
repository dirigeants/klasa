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
		const file = piece.type === 'command' ? join(...piece.file) : piece.file;
		const fileLocation = resolve(this.client.coreBaseDir, `${piece.type}s`, file);
		await fs.access(fileLocation).catch(() => { throw msg.language.get('COMMAND_TRANSFER_ERROR'); });
		try {
			const newFileLocation = resolve(this.client.clientBaseDir, `${piece.type}s`);
			await fs.copy(fileLocation, join(newFileLocation, file));
			this.client[`${piece.type}s`].load(newFileLocation, piece.file);
			if (this.client.sharded) {
				await this.client.shard.broadcastEval(`
					if (this.shard.id !== ${this.client.shard.id}) this.${piece.type}s.load('${newFileLocation}', ${JSON.stringify(piece.file)});
				`);
			}
			return msg.sendMessage(msg.language.get('COMMAND_TRANSFER_SUCCESS', piece.type, piece.name));
		} catch (err) {
			this.client.emit('error', err.stack);
			return msg.sendMessage(msg.language.get('COMMAND_TRANSFER_FAILED', piece.type, piece.name));
		}
	}

};
