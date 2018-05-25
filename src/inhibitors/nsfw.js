const { Inhibitor } = require('klasa');

module.exports = class extends Inhibitor {

	async run(message, command) {
		if (command.nsfw && !message.channel.nsfw) throw message.language.get('INHIBITOR_NSFW');
	}

};
