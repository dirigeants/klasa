const { Inhibitor } = require('klasa');

module.exports = class extends Inhibitor {

	async run(message, command) {
		if (!command.requiredSettings || !command.requiredSettings.length) return;
		if (message.channel.type !== 'text') return;
		const configs = message.guildConfigs;
		const requiredSettings = command.requiredSettings.filter(config => {
			const thisConfig = configs.get(config);
			return thisConfig === undefined || thisConfig === null;
		});
		if (requiredSettings.length) throw message.language.get('INHIBITOR_REQUIRED_CONFIGS', requiredSettings);
	}

};
