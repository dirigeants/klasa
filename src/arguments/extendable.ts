import { Argument, Possible, KlasaMessage, Extendable } from 'klasa';

export default class CoreArgument extends Argument {

	public run(argument: string, possible: Possible, message: KlasaMessage): Extendable {
		const extendable = this.client.extendables.get(argument);
		if (extendable) return extendable;
		throw message.language.get('RESOLVER_INVALID_PIECE', possible.name, 'extendable');
	}

}
