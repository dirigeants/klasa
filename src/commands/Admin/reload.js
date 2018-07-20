const { Command, Store, Stopwatch } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['r'],
			permissionLevel: 10,
			guarded: true,
			description: (message) => message.language.get('COMMAND_RELOAD_DESCRIPTION'),
			usage: '<everything|Store:store|Piece:piece>'
		});
	}

	async run(message, [piece]) {
		if (piece === 'everything') return this.everything(message);
		if (piece instanceof Store) {
			const timer = new Stopwatch();
			await piece.loadAll();
			await piece.init();
			if (this.client.shard) {
				await this.client.shard.broadcastEval(`
					if (this.shard.id !== ${this.client.shard.id}) this.${piece.name}.loadAll().then(() => this.${piece.name}.loadAll());
				`);
			}
			return message.sendMessage(`${message.language.get('COMMAND_RELOAD_ALL', piece, timer.stop())}`);
		}

		try {
			const itm = await piece.reload();
			const timer = new Stopwatch();
			if (this.client.shard) {
				await this.client.shard.broadcastEval(`
					if (this.shard.id !== ${this.client.shard.id}) this.${piece.store}.get('${piece.name}').reload();
				`);
			}
			return message.sendMessage(message.language.get('COMMAND_RELOAD', itm.type, itm.name, timer.stop.toString()));
		} catch (err) {
			piece.store.set(piece);
			return message.sendMessage(`❌ ${err}`);
		}
	}

	async everything(message) {
		const timer = new Stopwatch();
		await Promise.all(this.client.pieceStores.map(async (store) => {
			await store.loadAll();
			await store.init();
		}));
		if (this.client.shard) {
			await this.client.shard.broadcastEval(`
				if (this.shard.id !== ${this.client.shard.id}) this.client.pieceStores.map(async (store) => {
					await store.loadAll();
					await store.init();
				});
			`);
		}
		return message.sendMessage(`${message.language.get('COMMAND_RELOAD_EVERYTHING', timer.stop())}`);
	}

};
