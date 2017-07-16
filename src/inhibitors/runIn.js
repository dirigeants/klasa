const { Inhibitor } = require('klasa');

module.exports = class extends Inhibitor {

	constructor(...args) {
		super(...args, 'runIn', {});
	}

	async run(msg, cmd) {
		if (cmd.conf.runIn.length <= 0) throw `The ${cmd.help.name} command is not configured to run in any channel.`;
		if (cmd.conf.runIn.includes(msg.channel.type)) return;
		throw `This command is only avaliable in ${cmd.conf.runIn.join(' ')} channels`;
	}

};
