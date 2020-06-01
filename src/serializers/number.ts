import { Serializer, SerializerStore, SerializerUpdateContext } from 'klasa';

export default class CoreSerializer extends Serializer {

	public constructor(store: SerializerStore, directory: string, file: readonly string[]) {
		super(store, directory, file, { aliases: ['integer', 'float'] });
	}

	public async validate(data: string | number, { entry, language }: SerializerUpdateContext): Promise<number | null> {
		let number: number;
		switch (entry.type) {
			case 'integer':
				number = typeof data === 'number' ? data : parseInt(data);
				if (Number.isInteger(number)) return number;
				throw language.get('RESOLVER_INVALID_INT', entry.key);
			case 'number':
			case 'float':
				number = typeof data === 'number' ? data : parseFloat(data);
				if (!Number.isNaN(number)) return number;
				throw language.get('RESOLVER_INVALID_FLOAT', entry.key);
		}

		// noop
		return null;
	}

}
