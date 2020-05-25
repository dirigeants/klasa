import { Argument, ArgumentStore, Possible, KlasaMessage } from 'klasa';

export default class CoreArgument extends Argument {

	public constructor(store: ArgumentStore, directory: string, file: readonly string[]) {
		super(store, directory, file, { aliases: ['int'] });
	}

	public run(argument: string, possible: Possible, message: KlasaMessage): number | null {
		const { min, max } = possible;
		const number = parseInt(argument);
		if (!Number.isInteger(number)) throw message.language.get('RESOLVER_INVALID_INT', possible.name);
		return Argument.minOrMax(this.client, number, min, max, possible, message) ? number : null;
	}

}
