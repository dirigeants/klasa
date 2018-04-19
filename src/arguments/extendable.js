const { Argument } = require('klasa');

module.exports = class extends Argument {

	run(arg, possible, msg) {
		const extendable = this.client.extendables.get(arg);
		if (extendable) return extendable;
		throw (msg.language || this.client.languages.default).get('RESOLVER_INVALID_PIECE', possible.name, 'extendable');
	}

};
