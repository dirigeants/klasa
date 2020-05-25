import { Argument, ArgumentStore, Possible, KlasaMessage } from 'klasa';

export default class CoreArgument extends Argument {

	public constructor(store: ArgumentStore, directory: string, file: readonly string[]) {
		super(store, directory, file, { aliases: ['reg', 'regex'] });
	}

	public run(argument: string, possible: Possible, message: KlasaMessage): RegExpExecArray {
		const regex = possible.regex as RegExp;
		const results = regex.exec(argument);
		if (results) return results;
		throw message.language.get('RESOLVER_INVALID_REGEX_MATCH', possible.name, regex.toString());
	}

}
