const { Inhibitor } = require('klasa');

module.exports = class extends Inhibitor {

	async run(message, command) {
		if (!command.requiredSettings.length) return;
		if (message.channel.type !== 'text') return;
		const settings = message.guildSettings;
		const requiredSettings = command.requiredSettings.filter(config => {
			const thisConfig = settings.get(config);
			return thisConfig === undefined || thisConfig === null;
		});
		if (requiredSettings.length) throw message.language.get('INHIBITOR_REQUIRED_SETTINGS', requiredSettings);
	}

};
