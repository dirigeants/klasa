const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			permLevel: 10,
			description: 'Re-disables or temporarily disables a command/inhibitor/monitor/finalizer/event. Default state restored on reboot.',
			usage: '<Piece:piece>'
		});
	}

	async run(msg, [piece]) {
		if ((piece.type === 'event' && piece.name === 'Message') || (piece.type === 'monitor' && piece.name === 'commandHandler')) {
			return msg.sendMessage(msg.language.get('COMMAND_DISABLE_WARN'));
		}
		piece.disable();
		return msg.sendCode('diff', msg.language.get('COMMAND_DISABLE', piece.type, piece.name));
	}

};
