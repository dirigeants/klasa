const { Inhibitor } = require('klasa');

module.exports = class extends Inhibitor {

	async run(message, command) {
		const missingSettings = [];

		for (const [gateway, settings] of Object.entries(command.requiredSettings)) {
			if (gateway === 'guild' && message.channel.type !== 'text') continue;
			for (const setting of settings) {
				// eslint-disable-next-line eqeqeq
				if (message[gateway].settings.get(setting) == null) missingSettings.push([gateway, setting]);
			}
		}

		if (missingSettings.length) throw message.language.get('INHIBITOR_REQUIRED_SETTINGS', missingSettings);
	}

};
