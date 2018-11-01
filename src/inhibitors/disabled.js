const { Inhibitor } = require('klasa');

module.exports = class extends Inhibitor {

	async run(message, command) {
		if (!command.enabled || message.guildSettings.get('disabledCommands').includes(command.name)) throw message.language.get('INHIBITOR_DISABLED');
	}

};
