import { AliasPiece, Guild } from '@klasa/core';
import { MENTION_REGEX } from '../util/constants';

import type { Language } from './Language';
import type { SchemaEntry } from '../settings/schema/SchemaEntry';

export abstract class Serializer extends AliasPiece {

	/**
	 * Resolve a value given directly from the {@link Settings#update} call.
	 * @param data The data to resolve
	 * @param context The context in which this serializer is called
	 */
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public validate(data: unknown, _context: SerializerUpdateContext): unknown {
		return data;
	}

	/**
	 * Resolve a value given directly from the {@link Settings#resolve} call.
	 * @param data The data to resolve
	 * @param context The context in which this serializer is called
	 */
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public resolve(data: unknown, _context: SerializerUpdateContext): unknown {
		return data;
	}

	/**
	 * The deserialize method to be overwritten in actual Serializers.
	 * @param data The data to deserialize
	 * @param context The context in which this serializer is called
	 */
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public deserialize(data: unknown, _context: SerializerUpdateContext): unknown {
		return data;
	}

	/**
	 * The serialize method to be overwritten in actual Serializers.
	 * @param data The data to serialize
	 */
	public serialize(data: unknown): unknown {
		return data;
	}

	/**
	 * The stringify method to be overwritten in actual Serializers
	 * @param data The data to stringify
	 * @param guild The guild given for context in this call
	 */
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public stringify(data: unknown, _guild?: Guild | null): string {
		return String(data);
	}

	/**
	 * Check the boundaries of a key's minimum or maximum.
	 * @param value The value to check
	 * @param entry The schema entry that manages the key
	 * @param language The language that is used for this context
	 */
	protected static minOrMax(value: number, { minimum, maximum, inclusive, key }: SchemaEntry, language: Language): boolean {
		if (minimum && maximum) {
			if ((value >= minimum && value <= maximum && inclusive) || (value > minimum && value < maximum && !inclusive)) return true;
			if (minimum === maximum) throw language.get('RESOLVER_MINMAX_EXACTLY', key, minimum, inclusive);
			throw language.get('RESOLVER_MINMAX_BOTH', key, minimum, maximum, inclusive);
		} else if (minimum) {
			if ((value >= minimum && inclusive) || (value > minimum && !inclusive)) return true;
			throw language.get('RESOLVER_MINMAX_MIN', key, minimum, inclusive);
		} else if (maximum) {
			if ((value <= maximum && inclusive) || (value < maximum && !inclusive)) return true;
			throw language.get('RESOLVER_MINMAX_MAX', key, maximum, inclusive);
		}
		return true;
	}

	/**
	* Standard regular expressions for matching mentions and snowflake ids
	*/
	public static regex = MENTION_REGEX;

}

export interface SerializerUpdateContext {
	entry: SchemaEntry;
	language: Language;
	guild: Guild | null;
	extraContext: unknown;
}
