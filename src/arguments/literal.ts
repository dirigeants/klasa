import { Argument, Possible, KlasaMessage } from 'klasa';

export default class CoreArgument extends Argument {

	public run(argument: string, possible: Possible, message: KlasaMessage): string {
		if (argument.toLowerCase() === possible.name.toLowerCase()) return possible.name;
		throw message.language.get('RESOLVER_INVALID_LITERAL', possible.name);
	}

}
