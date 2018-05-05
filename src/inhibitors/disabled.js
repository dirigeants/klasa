const { Inhibitor } = require('klasa');

module.exports = class extends Inhibitor {

	async run(message, command) {
		if (command.enabled && !message.guildConfigs.disabledCommands.includes(command.name)) return;
		throw message.language.get('INHIBITOR_DISABLED');
	}

};
