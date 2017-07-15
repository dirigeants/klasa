const { Command } = require('../../index');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, 'enable', {
			permLevel: 10,
			description: 'Re-enables or temporarily enables a command/inhibitor/monitor/finalizer. Default state restored on reboot.',
			usage: '<Command:cmd|Inhibitor:inhibitor|Monitor:monitor|Finalizer:finalizer>'
		});
	}

	async run(msg, [piece]) {
		piece.enabled();
		return msg.sendCode('diff', `+ Successfully enabled ${piece.type}: ${piece.name}`);
	}

};
