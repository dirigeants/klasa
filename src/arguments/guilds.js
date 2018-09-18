const { MultiArgument } = require('klasa');

module.exports = class extends MultiArgument {

	constructor(...args) {
		super(...args, { aliases: ['...guild'] });
	}

	get base() {
		return this.store.get('guild');
	}

};
