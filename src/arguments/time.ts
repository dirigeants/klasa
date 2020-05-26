import { Argument, Possible, KlasaMessage, CustomUsageArgument } from 'klasa';

export default class CoreArgument extends Argument {

	public get date(): Argument {
		return this.store.get('date') as Argument;
	}

	public get duration(): Argument {
		return this.store.get('duration') as Argument;
	}

	public run(argument: string, possible: Possible, message: KlasaMessage, custom: CustomUsageArgument): Date {
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
