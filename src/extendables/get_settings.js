const { Extendable } = require('../index');

module.exports = class extends Extendable {

	constructor(...args) {
		super(...args, 'settings', ['Guild']);
	}

	get extend() {
		return this.client.settingGateway.get(this.id);
	}

};
