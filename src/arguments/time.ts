import { Argument, Possible, CustomUsageArgument } from 'klasa';

import type { Message } from '@klasa/core';

export default class CoreArgument extends Argument {

	public get date(): Argument {
		return this.store.get('date') as Argument;
	}

	public get duration(): Argument {
		return this.store.get('duration') as Argument;
	}

	public run(argument: string, possible: Possible, message: Message, custom: CustomUsageArgument): Date {
		let date: Date | undefined;
		try {
			date = this.date.run(argument, possible, message, custom) as Date;
		} catch (err) {
			try {
				date = this.duration.run(argument, possible, message, custom) as Date;
			} catch (error) {
				// noop
			}
		}
		if (date && !Number.isNaN(date.getTime()) && date.getTime() > Date.now()) return date;
		throw message.language.get('RESOLVER_INVALID_TIME', possible.name);
	}

}
