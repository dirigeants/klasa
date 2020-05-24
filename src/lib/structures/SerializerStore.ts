import { Serializer } from './Serializer';
import { AliasStore, PieceConstructor } from '@klasa/core';
import { KlasaClient } from '../Client';

export class SerializerStore extends AliasStore<Serializer> {

	/**
	 * Constructs our SerializerStore for use in Klasa.
	 * @param client The client that instantiates this store
	 */
	public constructor(client: KlasaClient) {
		super(client, 'serializers', Serializer as unknown as PieceConstructor<Serializer>);
	}

}
