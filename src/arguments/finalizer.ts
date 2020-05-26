import { Argument, Finalizer, Possible, KlasaMessage } from 'klasa';

export default class CoreArgument extends Argument {

	public run(argument: string, possible: Possible, message: KlasaMessage): Finalizer {
		const finalizer = this.client.finalizers.get(argument);
		if (finalizer) return finalizer;
		throw message.language.get('RESOLVER_INVALID_PIECE', possible.name, 'finalizer');
	}

}
