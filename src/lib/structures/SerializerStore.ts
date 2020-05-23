import { Serializer } from './Serializer';
import { AliasStore } from '@klasa/core';

import type { KlasaClient } from '../Client';

/**
 * Stores all the serializers usable in Klasa
 * @extends AliasStore
 */
export class SerializerStore extends AliasStore<Serializer> {

	constructor(client: KlasaClient) {
		super(client, 'serializers', Serializer);
	}

}
