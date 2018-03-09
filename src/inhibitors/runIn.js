const { Inhibitor } = require('klasa');

module.exports = class extends Inhibitor {

	async run(msg, cmd) {
		if (!cmd.runIn.length) throw msg.language.get('INHIBITOR_RUNIN_NONE', cmd.name);
		if (cmd.runIn.includes(msg.channel.type)) return;
		throw msg.language.get('INHIBITOR_RUNIN', cmd.runIn.join(', '));
	}

};
