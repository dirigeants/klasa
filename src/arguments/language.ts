import { Argument, Language, Possible, KlasaMessage } from 'klasa';

export default class CoreArgument extends Argument {

	public run(argument: string, possible: Possible, message: KlasaMessage): Language {
		const language = this.client.languages.get(argument);
		if (language) return language;
		throw message.language.get('RESOLVER_INVALID_PIECE', possible.name, 'language');
	}

}
