const { Argument } = require('klasa');

module.exports = class extends Argument {

	run(arg, possible, msg) {
		const language = this.client.languages.get(arg);
		if (language) return language;
		throw (msg.language || this.client.languages.default).get('RESOLVER_INVALID_PIECE', possible.name, 'language');
	}

};
