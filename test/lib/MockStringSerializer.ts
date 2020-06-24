import { Serializer, SerializerStore, SerializerUpdateContext } from '../../src';

export class MockStringSerializer extends Serializer {

	public constructor(store: SerializerStore, directory: string, file: string[]) {
		super(store, directory, file, { name: 'string' });
	}

	public deserialize(data: unknown): string {
		return String(data);
	}

	public validate(data: unknown, { entry, language }: SerializerUpdateContext): string | null {
		const parsed = String(data);
		return Serializer.minOrMax(parsed.length, entry, language) ? parsed : null;
	}

}
