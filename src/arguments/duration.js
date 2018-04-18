const { Argument, Duration } = require('klasa');

module.exports = class extends Argument {

	run(arg, possible, msg) {
		const date = new Duration(arg).fromNow;
		if (!isNaN(date.getTime()) && date.getTime() > Date.now()) return date;
		throw (msg.language || this.client.languages.default).get('RESOLVER_INVALID_DURATION', possible.name);
	}

};
