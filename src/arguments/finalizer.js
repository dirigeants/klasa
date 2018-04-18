const { Argument } = require('klasa');

module.exports = class extends Argument {

	run(arg, possible, msg) {
		const finalizer = this.client.finalizers.get(arg);
		if (finalizer) return finalizer;
		throw (msg.language || this.client.languages.default).get('RESOLVER_INVALID_PIECE', possible.name, 'finalizer');
	}

};
