const { Inhibitor } = require('klasa');

module.exports = class extends Inhibitor {

	constructor(...args) {
		super(...args, 'requiredSettings');
	}

	async run(msg, cmd) {
		if (cmd.requiredSettings.length === 0) return;
		const settings = cmd.requiredSettings.filter(setting => !msg.guildSettings[setting]);
		if (settings.length > 0) throw `The guild is missing the **${settings.join(', ')}** guild setting${settings.length > 1 ? 's' : ''} and cannot run.`;
		return;
	}

};
