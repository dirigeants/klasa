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
			await piece.loadAll();
			await piece.init();
			if (this.client.shard) {
				await this.client.shard.broadcastEval(`
					if (this.shard.id !== ${this.client.shard.id}) this.${piece.name}.loadAll().then(() => this.${piece.name}.loadAll());
				`);
			}
			return msg.sendMessage(`${msg.language.get('COMMAND_RELOAD_ALL', piece)} (Took: ${timer.stop()})`);
		}

		try {
			const itm = await piece.reload();
			if (this.client.shard) {
				await this.client.shard.broadcastEval(`
					if (this.shard.id !== ${this.client.shard.id}) this.${piece.store}.get('${piece.name}').reload();
				`);
			}
			return msg.sendMessage(msg.language.get('COMMAND_RELOAD', itm.type, itm.name));
		} catch (err) {
			piece.store.set(piece);
			return msg.sendMessage(`❌ ${err}`);
		}
	}

};
