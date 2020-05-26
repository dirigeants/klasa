import { Argument, Possible, KlasaMessage, Inhibitor } from 'klasa';

export default class CoreArgument extends Argument {

	public run(argument: string, possible: Possible, message: KlasaMessage): Inhibitor {
		const inhibitor = this.client.inhibitors.get(argument);
		if (inhibitor) return inhibitor;
		throw message.language.get('RESOLVER_INVALID_PIECE', possible.name, 'inhibitor');
	}

}
