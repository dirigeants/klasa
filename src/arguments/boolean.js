const { Argument } = require('klasa');

module.exports = class extends Argument {

	constructor(...args) {
		super(...args, { aliases: ['bool'] });
	}

	run(arg, possible, msg) {
		const boolean = String(arg).toLowerCase();
		if (['1', 'true', '+', 't', 'yes', 'y'].includes(boolean)) return true;
		if (['0', 'false', '-', 'f', 'no', 'n'].includes(boolean)) return false;
		throw (msg.language || this.client.languages.default).get('RESOLVER_INVALID_BOOL', possible.name);
	}

};
