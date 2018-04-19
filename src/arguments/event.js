const { Argument } = require('klasa');

module.exports = class extends Argument {

	run(arg, possible, msg) {
		const event = this.client.events.get(arg);
		if (event) return event;
		throw (msg.language || this.client.languages.default).get('RESOLVER_INVALID_PIECE', possible.name, 'event');
	}

};
