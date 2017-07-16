const { Command } = require('../../index');
const fs = require('fs-nextra');
const { resolve, join } = require('path');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, 'transfer', {
			permLevel: 10,
			description: 'Transfers a core piece to its respective folder',
			usage: '<Command:cmd|Inhibitor:inhibitor|Event:event|Monitor:monitor|Finalizer:finalizer>'
		});
	}

	async run(msg, [piece]) {
		const file = piece.type === 'command' ? join(...piece.help.fullCategory) : piece.file;
		const fileLocation = resolve(this.client.coreBaseDir, `${piece.type}s`, file);
		await fs.access(fileLocation).catch(() => { throw '❌ That file has been transfered already or never existed.'; });
		return fs.copy(fileLocation, resolve(this.client.clientBaseDir, `${piece.type}s`, file))
			.then(() => {
				this.client[`${piece.type}s`].load(resolve(this.client.clientBaseDir, `${piece.type}s`), piece.file || piece.help.fullCategory);
				return msg.sendMessage(`✅ Successfully Transferred ${piece.type}: ${piece.name || piece.help.name}`);
			})
			.catch((err) => {
				this.client.emit('error', err.stack);
				return msg.sendMessage(`Transfer of ${piece.type}: ${piece.name || piece.help.name} to Client has failed. Please check your Console.`);
			});
	}

};
