const { Extendable } = require('../index');

module.exports = class extends Extendable {

	constructor(...args) {
		super(...args, 'send', ['Message']);
	}

	extend(content, options) {
		return this.sendMessage(content, options);
	}

};
