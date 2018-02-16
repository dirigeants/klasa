const { Command, Stopwatch } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['l'],
			permLevel: 10,
			guarded: true,
			description: (msg) => msg.language.get('COMMAND_LOAD_DESCRIPTION'),
			usage: '[core] <Store:store> <path:string>',
			usageDelim: ' '
		});
		this.regExp = /\\\\?|\//g;
	}

	async run(msg, [_core, store, _path]) {
		if (!path.endsWith('.js')) _path += '.js';
		const path = _path.split(this.regExp);
		const core = Boolean(_core);
		const timer = new Stopwatch();
		const piece = store.load(path, core);

		try {
			if (!piece) throw msg.language.get('COMMAND_LOAD_FAIL');
			await piece.init();
			if (this.client.shard) {
				await this.client.shard.broadcastEval(`
					if (this.shard.id !== ${this.client.shard.id}) this.${piece.store}.load(${JSON.stringify(path)}, ${core});
				`);
			}
			return msg.sendMessage('COMMAND_LOAD', timer.stop(), store.name, piece.name);
		} catch (error) {
			timer.stop();
			throw msg.language.get('COMMAND_LOAD_ERROR', store.name, piece ? piece.name : path.join('/'), error);
		}
	}

};
