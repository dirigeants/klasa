const { Argument } = require('klasa');

module.exports = class extends Argument {

	constructor(...args) {
		super(...args, { aliases: ['int'] });
	}

	run(arg, possible, msg) {
		const { min, max } = possible;
		const number = parseInt(arg);
		if (!Number.isInteger(number)) throw (msg.language || this.client.languages.default).get('RESOLVER_INVALID_INT', possible.name);
		return this.constructor.minOrMax(this.client, arg, min, max, possible, msg) ? arg : null;
	}

};
