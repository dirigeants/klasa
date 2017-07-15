const { Extendable } = require('../index');

module.exports = class extends Extendable {

	constructor(...args) {
		super(...args, 'hasAtleastPermissionLevel', ['Message']);
	}

	extend(min) {
		return this.client.inhibitors.get('permissions').run(this, min).then(() => true).catch(() => false);
	}

};
