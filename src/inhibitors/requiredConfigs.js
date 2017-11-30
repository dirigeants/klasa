const { Inhibitor } = require('klasa');

module.exports = class extends Inhibitor {

	async run(msg, cmd) {
		if (cmd.requiredConfigs.length === 0) return;
		if (msg.channel.type !== 'text') return;
		const configs = msg.guildConfigs;
		const requiredConfigs = cmd.requiredConfigs.filter(config => !(config in configs));
		if (requiredConfigs.length > 0) throw msg.language.get('INHIBITOR_REQUIRED_CONFIGS', requiredConfigs);
		return;
	}

};
