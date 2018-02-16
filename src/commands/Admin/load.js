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

	async run(msg, [core, store, path]) {
		if (!path.endsWith('.js')) path += '.js';
		const timer = new Stopwatch();
		const piece = store.load(path.split(this.regExp), Boolean(core));

		try {
			if (!piece) throw msg.language.get('COMMAND_LOAD_FAIL');
			await piece.init();
			return msg.sendMessage('COMMAND_LOAD', timer.stop(), store.name, piece.name);
		} catch (error) {
			timer.stop();
			throw msg.language.get('COMMAND_LOAD_ERROR', store.name, piece ? piece.name : path, error);
		}
	}

};
