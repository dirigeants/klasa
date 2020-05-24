import { Argument, ArgumentStore, KlasaMessage, Possible } from 'klasa';
const truths = ['1', 'true', '+', 't', 'yes', 'y'];
const falses = ['0', 'false', '-', 'f', 'no', 'n'];

export default class CoreArgument extends Argument {

	public constructor(store: ArgumentStore, directory: string, file: readonly string[]) {
		super(store, directory, file, { aliases: ['bool'] });
	}

	public run(argument: string, possible: Possible, message: KlasaMessage): boolean {
		const boolean = String(argument).toLowerCase();
		if (truths.includes(boolean)) return true;
		if (falses.includes(boolean)) return false;
		throw message.language.get('RESOLVER_INVALID_BOOL', possible.name);
	}

}
