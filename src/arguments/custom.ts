import { Argument, KlasaMessage, Possible, CustomUsageArgument } from 'klasa';

export default class CoreArgument extends Argument {

	public async run(argument: string, possible: Possible, message: KlasaMessage, custom: CustomUsageArgument): Promise<unknown> {
		try {
			return await custom(argument, possible, message, message.params);
		} catch (err) {
			if (err) throw err;
			throw message.language.get('RESOLVER_INVALID_CUSTOM', possible.name, possible.type);
		}
	}

}
