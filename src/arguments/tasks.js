const { MultiArgument } = require('klasa');

module.exports = class extends MultiArgument {

	constructor(...args) {
		super(...args, { aliases: ['...task'] });
	}

	get base() {
		return this.store.get('task');
	}

};
