const { Command, Store, Stopwatch } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['r'],
			permissionLevel: 10,
			guarded: true,
			description: (message) => message.language.get('COMMAND_RELOAD_DESCRIPTION'),
			usage: '<all|Store:store|Piece:piece>'
		});
	}

	async run(message, [piece]) {
		if (piece === 'all') return this.all(message);
		if (piece instanceof Store) {
			const timer = new Stopwatch();
			await piece.loadAll();
			await piece.init();
			if (this.client.shard) {
				await this.client.shard.broadcastEval(`
					if (this.shard.id !== ${this.client.shard.id}) this.${piece.name}.loadAll().then(() => this.${piece.name}.loadAll());
				`);
			}
			return message.sendMessage(`${message.language.get('COMMAND_RELOAD_ALL', piece)} (Took: ${timer.stop()})`);
		}

		try {
			const itm = await piece.reload();
			if (this.client.shard) {
				await this.client.shard.broadcastEval(`
					if (this.shard.id !== ${this.client.shard.id}) this.${piece.store}.get('${piece.name}').reload();
				`);
			}
			return message.sendMessage(message.language.get('COMMAND_RELOAD', itm.type, itm.name));
		} catch (err) {
			piece.store.set(piece);
			return message.sendMessage(`❌ ${err}`);
		}
	}

	async all(message) {
		const timer = new Stopwatch();
		this.client.pieceStores.forEach(async (p) => {
			await p.loadAll();
			await p.init();
		});
		if (this.client.shard) {
			await this.client.shard.broadcastEval(`
				if (this.shard.id !== ${this.client.shard.id}) this.client.pieceStores.forEach(async (p) => await p.loadAll());
			`);
		}
		return message.sendMessage(`Reloaded all stores. (Took: ${timer.stop().toString()})`);
	}

};
