import { Argument, Possible } from 'klasa';

import type { Piece, Message } from '@klasa/core';

export default class CoreArgument extends Argument {

	public run(argument: string, possible: Possible, message: Message): Piece {
		for (const store of this.client.pieceStores.values()) {
			const piece = store.get(argument);
			if (piece) return piece;
		}
		throw message.language.get('RESOLVER_INVALID_PIECE', possible.name, 'piece');
	}

}
