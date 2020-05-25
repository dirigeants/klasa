import { Argument, Possible, KlasaMessage } from 'klasa';
import { Store, Piece } from '@klasa/core';

export default class CoreArgument extends Argument {

	public run(argument: string, possible: Possible, message: KlasaMessage): Store<Piece> {
		const store = this.client.pieceStores.get(argument);
		if (store) return store;
		throw message.language.get('RESOLVER_INVALID_PIECE', possible.name, 'store');
	}

}
