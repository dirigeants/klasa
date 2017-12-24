const { Command, Stopwatch } = require('klasa');

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
		if (piece instanceof this.client.methods.Collection) {
			const timer = new Stopwatch();
			await piece.loadAll();
			await piece.init();
			if (this.client.sharded) {
				await this.client.shard.broadcastEval(`
					if (this.shard.id !== ${this.client.shard.id}) this.${piece.name}.loadAll().then(() => this.${piece.name}.loadAll());
				`);
			}
			return msg.sendMessage(`${msg.language.get('COMMAND_RELOAD_ALL', piece)} (Took: ${timer.stop()})`);
		}

		try {
			const itm = await piece.reload();
			if (this.client.sharded) {
				await this.client.shard.broadcastEval(`
					if (this.shard.id !== ${this.client.shard.id}) this.${piece.type}s.get('${piece.name}').reload();
				`);
			}
			return msg.sendMessage(msg.language.get('COMMAND_RELOAD', itm.type, itm.name));
		} catch (err) {
			this.client[`${piece.type}s`].set(piece);
			return msg.sendMessage(`❌ ${err}`);
		}
	}

};
