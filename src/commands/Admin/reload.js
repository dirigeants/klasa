const { Command, Store, Stopwatch } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['r'],
			permLevel: 10,
			guarded: true,
			description: (msg) => msg.language.get('COMMAND_RELOAD_DESCRIPTION'),
			usage: '<Store:store|Piece:piece>'
		});
	}

	async run(msg, [piece]) {
		if (piece instanceof Store) {
			const timer = new Stopwatch();

			if (this.client.shard) {
				await this.client.shard.broadcastEval(async client => {
					const store = client.pieceStores.get(piece.name);
					await store.loadAll();
					await store.init();
				});
			} else {
				await piece.loadAll();
				await piece.init();
			}

			return msg.sendMessage(`${msg.language.get('COMMAND_RELOAD_ALL', piece)} (Took: ${timer.stop()})`);
		}

		try {
			if (this.client.shard) await this.client.shard.broadcastEval(client => client.pieceStores.get(piece.store.name).get(piece.name).reload());
			else await piece.reload();

			return msg.sendMessage(msg.language.get('COMMAND_RELOAD', piece.type, piece.name));
		} catch (err) {
			piece.store.set(piece);
			return msg.sendMessage(`❌ ${err}`);
		}
	}

};
