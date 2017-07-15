const { Extendable } = require('../index');

module.exports = class extends Extendable {

	constructor(...args) {
		super(...args, 'hasAtleastPermissionLevel', ['Message']);
	}

	extend(min) {
		return !!this.client.funcs.checkPerms(this.client, this, min);
	}

};
