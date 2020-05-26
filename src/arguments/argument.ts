import { Argument, KlasaMessage, Possible } from 'klasa';

export default class CoreArgument extends Argument {

	public run(argument: string, possible: Possible, message: KlasaMessage): Argument {
		const entry = this.client.arguments.get(argument);
		if (entry) return entry;
		throw message.language.get('RESOLVER_INVALID_PIECE', possible.name, 'argument');
	}

}
