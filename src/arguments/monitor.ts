import { Argument, Possible, KlasaMessage, Monitor } from 'klasa';

export default class CoreArgument extends Argument {

	public run(argument: string, possible: Possible, message: KlasaMessage): Monitor {
		const monitor = this.client.monitors.get(argument);
		if (monitor) return monitor;
		throw message.language.get('RESOLVER_INVALID_PIECE', possible.name, 'monitor');
	}

}
