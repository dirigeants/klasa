import { Argument } from './Argument';
import { Possible } from '../usage/Possible';
import { KlasaMessage } from '../extensions/KlasaMessage';
import { CommandPrompt } from '../usage/CommandPrompt';

/**
 * Base abstracted class for multi-resolving values.
 */
export class MultiArgument extends Argument {

	/**
	 * A getter for the base argument
	 * @since 0.5.0
	 */
	public get base(): Argument {
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
		// eslint-disable-next-line dot-notation
		const { args, usage: { usageDelim } } = message['prompter'] as CommandPrompt;
		const index = args.indexOf(argument);
		const rest = args.splice(index, args.length - index);
		const { base } = this;
		let i = 0;

		for (const arg of rest) {
			if (max && i >= max) break;
			try {
				const structure = await base.run(arg as string, possible, message);
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
