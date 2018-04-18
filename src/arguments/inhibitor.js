const { Argument } = require('klasa');

module.exports = class extends Argument {

	run(arg, possible, msg) {
		const inhibitor = this.client.inhibitors.get(arg);
		if (inhibitor) return inhibitor;
		throw (msg.language || this.client.languages.default).get('RESOLVER_INVALID_PIECE', possible.name, 'inhibitor');
	}

};
