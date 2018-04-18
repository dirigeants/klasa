const { Argument } = require('klasa');

module.exports = class extends Argument {

	run(arg, possible, msg) {
		if (arg.toLowerCase() === possible.name.toLowerCase()) return arg.toLowerCase();
		throw (msg.language || this.client.languages.default).get('RESOLVER_INVALID_LITERAL', possible.name);
	}

};
