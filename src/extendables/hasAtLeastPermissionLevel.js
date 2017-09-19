const { Extendable } = require('klasa');

module.exports = class extends Extendable {

	constructor(...args) {
		super(...args, ['Message']);
	}

	extend(min) {
		return this.client.permissionLevels.run(this, min).then(({ permission }) => permission);
	}

};
