import { Argument } from 'klasa';

export class extends Argument {

	run(arg, possible, message) {
		const finalizer = this.client.finalizers.get(arg);
		if (finalizer) return finalizer;
		throw message.language.get('RESOLVER_INVALID_PIECE', possible.name, 'finalizer');
	}

};
