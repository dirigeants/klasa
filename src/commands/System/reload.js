const { Command } = require('../../index');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, 'reload', {
			aliases: ['r'],
			permLevel: 10,
			description: "Reloads the klasa piece, if it's been updated or modified.",
			usage: '<inhibitors|finalizers|monitors|providers|events|commands|Inhibitor:inhibitor|Finalizer:finalizer|Monitor:monitor|Provider:provider|Event:event|Command:cmd>'
		});
	}

	async run(msg, [piece]) {
		if (typeof piece === 'string') return this.client[piece].loadAll().then(() => msg.sendMessage(`✅ Reloaded all ${piece}.`));
		return piece.reload()
			.then(itm => msg.sendMessage(`✅ Reloaded: ${itm.name || itm.help.name}`))
			.catch(err => {
				this.client[`${piece.type}s`].set(piece);
				msg.sendMessage(`❌ ${err}`);
			});
	}

};
