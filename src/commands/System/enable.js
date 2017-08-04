const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			permLevel: 10,
			description: 'Re-enables or temporarily enables a command/inhibitor/monitor/finalizer. Default state restored on reboot.',
			usage: '<Command:cmd|Inhibitor:inhibitor|Monitor:monitor|Finalizer:finalizer|Event:event|Extendable:extendable>'
		});
	}

	async run(msg, [piece]) {
		piece.enable();
		return msg.sendCode('diff', msg.language.get('COMMAND_ENABLE', piece.type, piece.name));
	}

};
