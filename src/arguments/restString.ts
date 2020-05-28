import { Argument, ArgumentStore, Possible, CustomUsageArgument } from 'klasa';

import type { Message } from '@klasa/core';

export default class CoreArgument extends Argument {

	public constructor(store: ArgumentStore, directory: string, file: readonly string[]) {
		super(store, directory, file, { name: '...string', aliases: ['...str'] });
	}

	public get base(): Argument {
		return this.store.get('string') as Argument;
	}

	public run(argument: string, possible: Possible, message: Message, custom: CustomUsageArgument): string {
		if (!argument) throw message.language.get('RESOLVER_INVALID_STRING', possible.name);
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const { args, usage: { usageDelim } } = message.prompter!;
		const index = args.indexOf(argument);
		const rest = args.splice(index, args.length - index).join(usageDelim);
		args.push(rest);
		return this.base.run(rest, possible, message, custom) as string;
	}

}
