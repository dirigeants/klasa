import { Serializer } from './Serializer';
import { AliasStore, PieceConstructor } from '@klasa/core';
import { KlasaClient } from '../Client';

/**
 * Stores all {@link Serializer} pieces for use in Klasa.
 * @since 0.5.0
 */
export class SerializerStore extends AliasStore<Serializer> {

	/**
	 * Constructs our SerializerStore for use in Klasa.
	 * @since 0.5.0
	 * @param client The Klasa client
	 */
	public constructor(client: KlasaClient) {
		super(client, 'serializers', Serializer as unknown as PieceConstructor<Serializer>);
	}

}
