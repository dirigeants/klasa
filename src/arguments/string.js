const { Argument } = require('klasa');

module.exports = class extends Argument {

	constructor(...args) {
		super(...args, { aliases: ['str'] });
	}

	run(arg, possible, message) {
		const { min, max } = possible;
		return this.constructor.minOrMax(this.client, arg.length, min, max, possible, message, 'RESOLVER_STRING_SUFFIX') ? arg : null;
	}

};
