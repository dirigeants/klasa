const { Inhibitor } = require('klasa');

module.exports = class extends Inhibitor {

	async run(message, command) {
		if (!command.requiredSettings.length) return;
		if (message.channel.type !== 'text') return;
		const settings = message.guildSettings;
		const requiredSettings = command.requiredSettings.filter(setting => {
			const thisSetting = settings.get(setting);
			return thisSetting === undefined || thisSetting === null;
		});
		if (requiredSettings.length) throw message.language.get('INHIBITOR_REQUIRED_SETTINGS', requiredSettings);
	}

};
