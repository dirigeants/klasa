const { Inhibitor } = require('klasa');

module.exports = class extends Inhibitor {

	async run(msg, cmd) {
		if (cmd.requiredSettings.length === 0) return;
		if (msg.channel.type !== 'text') return;
		const settings = msg.guildConfigs;
		const requiredSettings = cmd.requiredSettings.filter(setting => !settings.get(setting));
		if (requiredSettings.length > 0) throw msg.language.get('INHIBITOR_REQUIRED_SETTINGS', requiredSettings);
		return;
	}

};
