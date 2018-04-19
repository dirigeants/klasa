const { Argument } = require('klasa');

module.exports = class extends Argument {

	run(arg, possible, msg) {
		const store = this.client.pieceStores.get(arg);
		if (store) return store;
		throw (msg.language || this.client.languages.default).get('RESOLVER_INVALID_PIECE', possible.name, 'store');
	}

};
