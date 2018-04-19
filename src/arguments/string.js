const { Argument } = require('klasa');

module.exports = class extends Argument {

	constructor(...args) {
		super(...args, { aliases: ['str'] });
	}

	run(arg, possible, msg) {
		const { min, max } = possible;
		return this.constructor.minOrMax(this.client, arg.length, min, max, possible, msg, 'RESOLVER_STRING_SUFFIX') ? arg : null;
	}

};
