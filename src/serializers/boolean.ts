import { Serializer, SerializerStore, SerializerUpdateContext } from 'klasa';

const truths = ['1', 'true', '+', 't', 'yes', 'y'];
const falses = ['0', 'false', '-', 'f', 'no', 'n'];

export default class CoreSerializer extends Serializer {

	public constructor(store: SerializerStore, directory: string, file: readonly string[]) {
		super(store, directory, file, { aliases: ['bool'] });
	}

	public async validate(data: unknown, { entry, language }: SerializerUpdateContext): Promise<boolean> {
		const boolean = String(data).toLowerCase();
		if (truths.includes(boolean)) return true;
		if (falses.includes(boolean)) return false;
		throw language.get('RESOLVER_INVALID_BOOL', entry.key);
	}

	public stringify(value: boolean): string {
		return value ? 'Enabled' : 'Disabled';
	}

}
