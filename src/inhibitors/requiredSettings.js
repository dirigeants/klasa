const { Inhibitor } = require('klasa');

module.exports = class extends Inhibitor {

	async run(message, command) {
		const gateways = Object.keys(command.requiredSettings);
		if (!gateways.length) return;
		
		const missingSettings = [];
		
		for (const gateway of gateways) {
			for (const setting of command.requireSettings[gateway]) {
				if (message[gateway].settings.get(setting) == null) missingSettings.push([gateway, setting]);
			}
		}

		if (requiredSettings.length) throw message.language.get('INHIBITOR_REQUIRED_SETTINGS', requiredSettings);
	}

};
