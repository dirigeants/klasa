const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['r'],
			permLevel: 10,
			description: "Reloads the klasa piece, if it's been updated or modified.",
			usage: '<inhibitors|finalizers|monitors|providers|events|commands|Inhibitor:inhibitor|Extendable:extendable|Finalizer:finalizer|Monitor:monitor|Provider:provider|Event:event|Command:cmd>'
		});
	}

	async run(msg, [piece]) {
		if (typeof piece === 'string') return this.client[piece].loadAll().then(() => msg.sendMessage(msg.language.get('COMMAND_RELOAD_ALL', piece)));
		return piece.reload()
			.then(itm => msg.sendMessage(msg.language.get('RELOAD', itm.type, itm.name)))
			.catch(err => {
				this.client[`${piece.type}s`].set(piece);
				msg.sendMessage(`❌ ${err}`);
			});
	}

};
