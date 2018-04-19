const { Command, Stopwatch } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['l'],
			permissionLevel: 10,
			guarded: true,
			description: (message) => message.language.get('COMMAND_LOAD_DESCRIPTION'),
			usage: '[core] <Store:store> <path:string>',
			usageDelim: ' '
		});
		this.regExp = /\\\\?|\//g;
	}

	async run(message, [core, store, path]) {
		path = (path.endsWith('.js') ? path : `${path}.js`).split(this.regExp);
		core = Boolean(core);
		const timer = new Stopwatch();
		const piece = store.load(path, core);

		try {
			if (!piece) throw message.language.get('COMMAND_LOAD_FAIL');
			await piece.init();
			if (this.client.shard) {
				await this.client.shard.broadcastEval(`
					if (this.shard.id !== ${this.client.shard.id}) {
						const piece = this.${piece.store}.load(${JSON.stringify(path)}, ${core});
						if (piece) piece.init();
					}
				`);
			}
			return message.sendMessage(message.language.get('COMMAND_LOAD', timer.stop(), store.name, piece.name));
		} catch (error) {
			timer.stop();
			throw message.language.get('COMMAND_LOAD_ERROR', store.name, piece ? piece.name : path.join('/'), error);
		}
	}

};
