const { Inhibitor } = require('klasa');

module.exports = class extends Inhibitor {

	async run(msg, cmd) {
		if (cmd.nsfw && !msg.channel.nsfw) throw msg.language.get('INHIBITOR_NSFW');
	}

};
