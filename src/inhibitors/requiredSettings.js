const { Inhibitor } = require('klasa');

module.exports = class extends Inhibitor {

	async run(message, command) {
		if (!command.requiredSettings.length) return;
		
		// eslint-disable-next-line eqeqeq
		const requiredSettings = command.requiredSettings.filter(setting => message[setting[0]].settings.get(setting[1]) == null);
		if (requiredSettings.length) throw message.language.get('INHIBITOR_REQUIRED_SETTINGS', requiredSettings, guildOrAuthor);
	}

};
