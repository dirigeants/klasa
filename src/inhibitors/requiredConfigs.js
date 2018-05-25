const { Inhibitor } = require('klasa');

module.exports = class extends Inhibitor {

	async run(message, command) {
		if (!command.requiredConfigs.length) return;
		if (message.channel.type !== 'text') return;
		const configs = message.guildConfigs;
		const requiredConfigs = command.requiredConfigs.filter(config => {
			const thisConfig = configs.get(config);
			return thisConfig === undefined || thisConfig === null;
		});
		if (requiredConfigs.length) throw message.language.get('INHIBITOR_REQUIRED_CONFIGS', requiredConfigs);
	}

};
