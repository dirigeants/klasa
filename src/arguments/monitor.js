const { Argument } = require('klasa');

module.exports = class extends Argument {

	run(arg, possible, msg) {
		const monitor = this.client.monitors.get(arg);
		if (monitor) return monitor;
		throw (msg.language || this.client.languages.default).get('RESOLVER_INVALID_PIECE', possible.name, 'monitor');
	}

};
