const { Inhibitor } = require('klasa');

module.exports = class extends Inhibitor {

	async run(msg, cmd) {
		if (cmd.requiredSettings.length === 0) return;
		const settings = cmd.requiredSettings.filter(setting => !msg.guildSettings[setting]);
		if (settings.length > 0) throw msg.language.get('INHIBITOR_REQUIRED_SETTINGS', settings);
		return;
	}

};
