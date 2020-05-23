import { Argument } from './Argument';
import { Possible } from '../usage/Possible';
import { KlasaMessage } from '../extensions/KlasaMessage';

/**
 * Base Abstracted class for Multi-Resolving D.JS and Klasa Structures.
 * @extends Argument
 */
export class MultiArgument extends Argument {

	/**
	 * A getter for the base argument
	 * @since 0.5.0
	 * @type {Argument}
	 * @readonly
	 * @abstract
	 */
	get base(): unknown {
		throw new Error('A "base" getter must be implemented in extended classes.');
	}


	/**
	 * The run method for handling MultiArguments (not to be implemented in extended classes)
	 * @since 0.5.0
	 * @param {string} argument The string argument string to resolve
	 * @param {Possible} possible This current usage possible
	 * @param {KlasaMessage} message The message that triggered the command
	 */
	public async run(argument: string, possible: Possible, message: KlasaMessage): Promise<any[]> {
		const structures = [];
		const { min, max } = possible;
		const { args, usage: { usageDelim } } = message.prompter;
		const index = args.indexOf(argument);
		const rest = args.splice(index, args.length - index);
		const { base } = this;
		let i = 0;

		for (const arg of rest) {
			if (max && i >= max) break;
			try {
				const structure = await base.run(arg, possible, message);
				structures.push(structure);
				i++;
			} catch (err) {
				break;
			}
		}

		args.push(rest.splice(0, structures.length).join(usageDelim), ...rest);
		if ((min && structures.length < min) || !structures.length) throw message.language.get(`RESOLVER_MULTI_TOO_FEW`, base.name, min);
		return structures;
	}

}
