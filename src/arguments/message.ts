import { Argument, ArgumentStore, Possible, KlasaMessage } from 'klasa';
import { Message } from '@klasa/core';

export default class CoreArgument extends Argument {

	public constructor(store: ArgumentStore, directory: string, file: readonly string[]) {
		super(store, directory, file, { aliases: ['msg'] });
	}

	public async run(argument: string, possible: Possible, message: KlasaMessage): Promise<Message> {
		const msg = Argument.regex.snowflake.test(argument) ? await message.channel.messages.fetch(argument).catch(() => null) : undefined;
		if (msg) return msg;
		throw message.language.get('RESOLVER_INVALID_MESSAGE', possible.name);
	}

}
