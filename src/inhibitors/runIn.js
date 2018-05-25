const { Inhibitor } = require('klasa');

module.exports = class extends Inhibitor {

	async run(message, command) {
		if (!command.runIn.length) throw message.language.get('INHIBITOR_RUNIN_NONE', command.name);
		if (command.runIn.includes(message.channel.type)) return;
		throw message.language.get('INHIBITOR_RUNIN', command.runIn.join(', '));
	}

};
