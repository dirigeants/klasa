import { Serializer, SerializerStore } from '../../src';

export class MockObjectSerializer extends Serializer {

	public constructor(store: SerializerStore, directory: string, file: string[]) {
		super(store, directory, file, { name: 'object' });
	}

	public resolve(data: unknown): unknown {
		return data === null ? null : { data };
	}

}
