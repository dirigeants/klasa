const { Command } = require('klasa');
const fs = require('fs-nextra');
const { resolve, join } = require('path');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			permLevel: 10,
			description: 'Transfers a core piece to its respective folder',
			usage: '<Piece:piece>'
		});
	}

	async run(msg, [piece]) {
		const file = piece.type === 'command' ? join(...piece.file) : piece.file;
		const fileLocation = resolve(this.client.coreBaseDir, `${piece.type}s`, file);
		await fs.access(fileLocation).catch(() => { throw msg.language.get('COMMAND_TRANSFER_ERROR'); });
		return fs.copy(fileLocation, resolve(this.client.clientBaseDir, `${piece.type}s`, file))
			.then(() => {
				this.client[`${piece.type}s`].load(resolve(this.client.clientBaseDir, `${piece.type}s`), piece.file);
				return msg.sendMessage(msg.language.get('COMMAND_TRANSFER_SUCCESS', piece.type, piece.name));
			})
			.catch((err) => {
				this.client.emit('error', err.stack);
				return msg.sendMessage(msg.language.get('COMMAND_TRANSFER_FAILED', piece.type, piece.name));
			});
	}

};
