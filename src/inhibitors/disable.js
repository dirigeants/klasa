const { Inhibitor } = require('klasa');

module.exports = class extends Inhibitor {

	constructor(...args) {
		super(...args, 'cooldown', { });
	}

	async run(msg, cmd) {
		if (cmd.conf.enabled && !msg.guildSettings.disabledCommands.includes(cmd.help.name)) return;
		throw 'This command is currently disabled';
	}

};
