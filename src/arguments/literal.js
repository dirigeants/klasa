const { Argument } = require('klasa');

module.exports = class extends Argument {

	run(arg, possible, message) {
		if (arg.toLowerCase() === possible.name.toLowerCase()) return arg.toLowerCase();
		throw (message.language || this.client.languages.default).get('RESOLVER_INVALID_LITERAL', possible.name);
	}

};
