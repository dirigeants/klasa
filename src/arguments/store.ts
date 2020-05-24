import { Argument } from 'klasa';

export default class CoreArgument extends Argument {

	run(arg, possible, message) {
		const store = this.client.pieceStores.get(arg);
		if (store) return store;
		throw message.language.get('RESOLVER_INVALID_PIECE', possible.name, 'store');
	}

}
