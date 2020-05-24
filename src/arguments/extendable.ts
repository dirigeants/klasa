import { Argument } from 'klasa';

export default class CoreArgument extends Argument {

	run(arg, possible, message) {
		const extendable = this.client.extendables.get(arg);
		if (extendable) return extendable;
		throw message.language.get('RESOLVER_INVALID_PIECE', possible.name, 'extendable');
	}

}
