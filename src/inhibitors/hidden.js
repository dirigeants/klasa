const { Inhibitor } = require('klasa');

module.exports = class extends Inhibitor {

	async run(message, command) {
		if (command.hidden && message.command !== command && message.author !== this.client.owner) throw true;
	}

};
