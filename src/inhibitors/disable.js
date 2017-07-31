const { Inhibitor } = require('klasa');

module.exports = class extends Inhibitor {

	async run(msg, cmd) {
		if (cmd.enabled && !msg.guildSettings.disabledCommands.includes(cmd.name)) return;
		throw msg.language.get('INHIBITOR_DISABLED');
	}

};
