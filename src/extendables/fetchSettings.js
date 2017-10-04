const { Extendable } = require('klasa');

module.exports = class extends Extendable {

	constructor(...args) {
		super(...args, ['Guild']);
	}

	extend() {
		return this.client.settings.guilds.fetchEntry(this.id);
	}

};
