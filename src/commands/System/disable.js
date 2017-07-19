const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, 'disable', {
			permLevel: 10,
			description: 'Re-disables or temporarily disables a command/inhibitor/monitor/finalizer/event. Default state restored on reboot.',
			usage: '<Command:cmd|Inhibitor:inhibitor|Monitor:monitor|Finalizer:finalizer|Event:event>'
		});
	}

	async run(msg, [piece]) {
		if ((piece.type === 'event' && piece.name === 'Message') || (piece.type === 'monitor' && piece.name === 'commandHandler')) {
			return msg.sendMessage('You probably don\'t want to disable that, since you wouldn\'t be able to run any command to enable it again');
		}
		piece.disable();
		return msg.sendCode('diff', `+ Successfully disabled ${piece.type}: ${piece.name}`);
	}

};
