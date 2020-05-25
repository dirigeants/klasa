import { Argument, Possible, KlasaMessage, Provider } from 'klasa';

export default class CoreArgument extends Argument {

	public run(argument: string, possible: Possible, message: KlasaMessage): Provider {
		const provider = this.client.providers.get(argument);
		if (provider) return provider;
		throw message.language.get('RESOLVER_INVALID_PIECE', possible.name, 'provider');
	}

}
