import { Argument, Possible, KlasaMessage } from 'klasa';

export default class CoreArgument extends Argument {

	public run(argument: string, possible: Possible, message: KlasaMessage): string {
		const literal = possible.name.toLowerCase();
		if (typeof argument === 'undefined' || argument.toLowerCase() !== literal) message.args.splice(message.params.length, 0, undefined);
		return literal;
	}

}
