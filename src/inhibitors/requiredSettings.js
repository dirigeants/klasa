const { Inhibitor } = require('klasa');

module.exports = class extends Inhibitor {

	async run(msg, cmd) {
		if (cmd.requiredSettings.length === 0) return;
		const settings = await msg.fetchGuildSettings();
		const requiredSettings = cmd.requiredSettings.filter(setting => !settings[setting]);
		if (requiredSettings.length > 0) throw await msg.fetchLanguageCode('INHIBITOR_REQUIRED_SETTINGS', requiredSettings);
		return;
	}

};
