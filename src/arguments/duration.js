import { Argument, Duration } from 'klasa';

export class extends Argument {

	run(arg, possible, message) {
		const date = new Duration(arg).fromNow;
		if (!isNaN(date.getTime()) && date.getTime() > Date.now()) return date;
		throw message.language.get('RESOLVER_INVALID_DURATION', possible.name);
	}

};
