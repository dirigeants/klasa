const { Inhibitor } = require('klasa');

module.exports = class extends Inhibitor {

	constructor(...args) {
		super(...args, 'disable', { });
	}

	async run(msg, cmd) {
		if (cmd.enabled && !msg.guildSettings.disabledCommands.includes(cmd.name)) return;
		throw 'This command is currently disabled';
	}

};
