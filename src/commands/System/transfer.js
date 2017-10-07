const { Command } = require('klasa');
const fs = require('fs-nextra');
const { resolve, join } = require('path');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			permLevel: 10,
			description: 'Transfers a core piece to its respective folder',
			usage: '<Command:cmd|Inhibitor:inhibitor|Event:event|Monitor:monitor|Language:language|Finalizer:finalizer>'
		});
	}

	async run(msg, [piece]) {
		const file = piece.type === 'command' ? join(...piece.file) : piece.file;
		const fileLocation = resolve(this.client.coreBaseDir, `${piece.type}s`, file);
		await fs.access(fileLocation).catch(() => { throw msg.fetchLanguageCode('COMMAND_TRANSFER_ERROR'); });
		return fs.copy(fileLocation, resolve(this.client.clientBaseDir, `${piece.type}s`, file))
			.then(async () => {
				this.client[`${piece.type}s`].load(resolve(this.client.clientBaseDir, `${piece.type}s`), piece.file);
				return msg.sendMessage(await msg.fetchLanguageCode('COMMAND_TRANSFER_SUCCESS', piece.type, piece.name));
			})
			.catch(async (err) => {
				this.client.emit('error', err.stack);
				return msg.sendMessage(await msg.fetchLanguageCode('COMMAND_TRANSFER_FAILED', piece.type, piece.name));
			});
	}

};
