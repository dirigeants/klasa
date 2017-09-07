const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['r'],
			permLevel: 10,
			botPerms: ["SEND_MESSAGES"],
			description: 'Reloads a klasa piece, or all pieces of a klasa store.',
			usage: '<Store:store|Piece:piece>'
		});
	}

	async run(msg, [piece]) {
		if (piece instanceof this.client.methods.Collection) return piece.loadAll().then(() => msg.sendMessage(msg.language.get('COMMAND_RELOAD_ALL', msg.args[0].toLowerCase())));
		return piece.reload()
			.then(itm => msg.sendMessage(msg.language.get('COMMAND_RELOAD', itm.type, itm.name)))
			.catch(err => {
				this.client[`${piece.type}s`].set(piece);
				msg.sendMessage(`❌ ${err}`);
			});
	}

};
