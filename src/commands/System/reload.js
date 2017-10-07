const { Command } = require('klasa');
const now = require('performance-now');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['r'],
			permLevel: 10,
			description: 'Reloads a klasa piece, or all pieces of a klasa store.',
			usage: '<Store:store|Piece:piece>'
		});
	}

	async run(msg, [piece]) {
		if (piece instanceof this.client.methods.Collection) {
			const start = now();
			await this.client[piece].loadAll();
			await this.client[piece].init();
			return msg.sendMessage(`${await msg.fetchLanguageCode('COMMAND_RELOAD_ALL', piece)} (Took: ${(now() - start).toFixed(2)}ms.)`);
		}
		return piece.reload()
			.then(async itm => msg.sendMessage(await msg.fetchLanguageCode('COMMAND_RELOAD', itm.type, itm.name)))
			.catch(err => {
				this.client[`${piece.type}s`].set(piece);
				msg.sendMessage(`❌ ${err}`);
			});
	}

};
