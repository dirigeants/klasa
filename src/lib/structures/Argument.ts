import { AliasPiece, Client, Message } from '@klasa/core';
import { MENTION_REGEX } from '../util/constants';

import type { Possible } from '../usage/Possible';
import type { Language } from './Language';
import type { CustomUsageArgument } from '../usage/Usage';

/**
 * Base class for all Klasa Arguments. See {@tutorial CreatingArguments} for more information how to use this class
 * to build custom arguments.
 * @tutorial CreatingArguments
 */
export abstract class Argument extends AliasPiece {

	/**
	 * The run method to be overwritten in actual Arguments
	 * @since 0.5.0
	 * @param argument The string argument string to resolve
	 * @param possible This current usage possible
	 * @param message The message that triggered the command
	 */
	public abstract run(argument: string, possible: Possible, message: Message, custom?: CustomUsageArgument): unknown | Promise<unknown>;

	/**
	 * Checks min and max values
	 * @since 0.5.0
	 * @param client The client of this bot
	 * @param value The value to check against
	 * @param min The minimum value
	 * @param max The maximum value
	 * @param possible The id of the current possible usage
	 * @param message The message that triggered the command
	 * @param suffix An error suffix
	 */
	protected static minOrMax(client: Client, value: number, min: number | null = null, max: number | null = null, possible: Possible, message: Message, suffix?: string): boolean {
		const language = (message ? message.language : client.languages.default) as Language;
		suffix = suffix ? language.get(suffix) as string : '';
		if (min !== null && max !== null) {
			if (value >= min && value <= max) return true;
			if (min === max) throw language.get('RESOLVER_MINMAX_EXACTLY', possible.name, min, suffix);
			throw language.get('RESOLVER_MINMAX_BOTH', possible.name, min, max, suffix);
		} else if (min !== null) {
			if (value >= min) return true;
			throw language.get('RESOLVER_MINMAX_MIN', possible.name, min, suffix);
		} else if (max !== null) {
			if (value <= max) return true;
			throw language.get('RESOLVER_MINMAX_MAX', possible.name, max, suffix);
		}
		return true;
	}

	/**
	 * Standard regular expressions for matching mentions and snowflake ids
	 * @since 0.5.0
	 */
	public static regex = MENTION_REGEX;

}
