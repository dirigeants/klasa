const { Command, Store, Stopwatch } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['r'],
			permissionLevel: 10,
			guarded: true,
			description: language => language.get('COMMAND_RELOAD_DESCRIPTION'),
			usage: '<Store:store|Piece:piece|path:str|everything:default>'
		});
	}

	async run(message, [piece]) {
		if (piece === 'everything') return this.everything(message);
		if (typeof piece === 'string') return this.nonPieces(message, piece);
		if (piece instanceof Store) {
			const timer = new Stopwatch();
			await piece.loadAll();
			await piece.init();
			if (this.client.shard) {
				await this.client.shard.broadcastEval(`
					if (this.shard.id !== ${this.client.shard.id}) this.${piece.name}.loadAll().then(() => this.${piece.name}.loadAll());
				`);
			}
			return message.sendLocale('COMMAND_RELOAD_ALL', [piece, timer.stop()]);
		}

		try {
			const itm = await piece.reload();
			const timer = new Stopwatch();
			if (this.client.shard) {
				await this.client.shard.broadcastEval(`
					if (this.shard.id !== ${this.client.shard.id}) this.${piece.store}.get('${piece.name}').reload();
				`);
			}
			return message.sendLocale('COMMAND_RELOAD', [itm.type, itm.name, timer.stop()]);
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
		return message.sendLocale('COMMAND_RELOAD_EVERYTHING', [timer.stop()]);
	}
	
	async nonPieces(message, path) {
		const msg = await message.sendMessage('Reloading non-piece files...');
		const userModules = [];

		for (const key of Object.keys(require.cache)) {
			if (key.includes('node_modules')) continue;
			userModules.push(key);
		}
		
		if (path !== 'all') {
			userModules = userModules.filter(modulePath => modulePath.includes(path));
			if (!userModules.length) return msg.edit(`No modules found matching \`${path}\`.`);
		}
		
		const watch = new Stopwatch().start();

		for (const key of userModules) delete require.cache[require.resolve(key)];

		this.client.commands.get('reload').run(message, ['everything']);

		if (this.client.shard) {
			await this.client.shard.broadcastEval(`
				if (this.shard.id === ${this.client.shard.id}) return;

				for (const key of ${userModules}) delete require.cache[require.resolve(key)];

				this.commands.get('reload').run(${message}, ['everything']);
			`);
		}

		return msg.edit(`Done. All modules reloaded ${this.client.shard ? 'on all shards in' : 'in'} ${watch.stop()}.`);
	}

};
