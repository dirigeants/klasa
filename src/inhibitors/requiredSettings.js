const { Inhibitor } = require('klasa');

module.exports = class extends Inhibitor {

	async run(message, command) {
		const gateways = Object.keys(command.requiredSettings);
		if (!gateways.length) return;

		const missingSettings = [];

		for (const [gateway, settings] of Object.entries(command.requiredSettings)) {
			for (const setting of settings) {
				// eslint-disable-next-line eqeqeq
				if (message[gateway].settings.get(setting) == null) missingSettings.push([gateway, setting]);
			}
		}

		if (missingSettings.length) throw message.language.get('INHIBITOR_REQUIRED_SETTINGS', missingSettings);
	}

};
