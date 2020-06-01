import { Serializer, SerializerStore, SerializerUpdateContext } from '../../src';

export class MockNumberSerializer extends Serializer {

	public constructor(store: SerializerStore, directory: string, file: string[]) {
		super(store, directory, file, { name: 'number', aliases: ['integer', 'float'] });
	}

	public deserialize(data: unknown): number {
		return Number(data);
	}

	public validate(data: unknown, { entry, language }: SerializerUpdateContext): number | null {
		let parsed: number;
		switch (entry.type) {
			case 'integer':
				parsed = parseInt(data as string);
				if (Number.isInteger(parsed) && Serializer.minOrMax(parsed, entry, language)) return parsed;
				throw language.get('RESOLVER_INVALID_INT', entry.key);
			case 'number':
			case 'float':
				parsed = parseFloat(data as string);
				if (!isNaN(parsed) && Serializer.minOrMax(parsed, entry, language)) return parsed;
				throw language.get('RESOLVER_INVALID_FLOAT', entry.key);
		}
		// noop
		return null;
	}

}
