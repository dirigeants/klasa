const { Argument } = require('klasa');

module.exports = class extends Argument {

	run(arg, possible, message) {
		const argument = this.client.arguments.get(arg);
		if (argument) return argument;
		throw (message.language || this.client.languages.default).get('RESOLVER_INVALID_PIECE', possible.name, 'argument');
	}

};
