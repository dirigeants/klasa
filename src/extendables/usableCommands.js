const { Extendable } = require('klasa');

module.exports = class extends Extendable {

	constructor(...args) {
		super(...args, ['Message']);
	}

	get extend() {
		this.client.commands.filter(command => !this.client.commandInhibitors.some((inhibitor) => {
			if (inhibitor.enabled && !inhibitor.spamProtection) return inhibitor.run(this.client, this, command);
			return false;
		}));
	}

};
