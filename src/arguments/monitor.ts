import { Argument } from 'klasa';

export default class CoreArgument extends Argument {

	run(arg, possible, message) {
		const monitor = this.client.monitors.get(arg);
		if (monitor) return monitor;
		throw message.language.get('RESOLVER_INVALID_PIECE', possible.name, 'monitor');
	}

}
