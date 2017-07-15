const { Extendable } = require('../index');

module.exports = class extends Extendable {

	constructor(...args) {
		super(...args, 'usableCommands', ['Message']);
	}

	get extend() {
		this.client.commands.filter(command => !this.client.commandInhibitors.some((inhibitor) => {
			if (inhibitor.conf.enabled && !inhibitor.conf.spamProtection) return inhibitor.run(this.client, this, command);
			return false;
		}));
	}

};
