import { Possible } from './Possible';

import type { Message } from '@klasa/core';

export const enum TagRequirement {
	Optional,
	SemiRequired,
	Required
}

/**
 * Represents a Tag's response.
 * @since 0.5.0
 */
export interface TagResponse {
	/**
	 * @since 0.5.0
	 * @param message The message.
	 * @param possible The possible.
	 */
	(message: Message, possible: Possible): string;
}

/**
 * Represents a usage Tag
 */
export class Tag {

	/**
	 * The type of this tag
	 * @since 0.5.0
	 */
	public required: number;

	/**
	 * If this tag is repeating
	 * @since 0.5.0
	 */
	public repeat: boolean;

	/**
	 * The possibilities of this tag
	 * @since 0.2.1
	 */
	public possibles: Possible[];

	/**
	 * The custom response defined for this possible
	 * @since 0.5.0
	 */
	public response: string | TagResponse | null;

	/**
	 * @since 0.2.1
	 * @param members The tag contents to parse
	 * @param count The position of the tag in the usage string
	 * @param required The type of tag
	 */
	public constructor(members: string, count: number, required: TagRequirement) {
		this.required = required;
		this.repeat = false;
		this.possibles = (this.constructor as typeof Tag).parseMembers(members, count);
		this.response = null;
	}

	/**
	 * Registers a response
	 * @since 0.5.0
	 * @param name The argument name the response is for
	 * @param response The custom response
	 */
	public register(name: string, response: string | TagResponse): boolean {
		if (this.response) return false;
		if (this.possibles.some(val => val.name === name)) {
			this.response = response;
			return true;
		}
		return false;
	}

	/**
	 * Parses members into usable possibles
	 * @since 0.2.1
	 * @param rawMembers The tag contents to parse
	 * @param count The position of the tag in the usage string
	 */
	private static parseMembers(rawMembers: string, count: number): Possible[] {
		const literals: string[] = [];
		const types: string[] = [];
		const members = this.parseTrueMembers(rawMembers);
		return members.map((member, i) => {
			const current = `${members.join('|')}: at tag #${count} at bound #${i + 1}`;
			let possible;
			try {
				possible = new Possible(this.pattern.exec(member) as RegExpExecArray);
			} catch (err) {
				if (typeof err === 'string') throw `${current}: ${err}`;
				throw `${current}: invalid syntax, non specific`;
			}
			if (possible.type === 'literal') {
				if (literals.includes(possible.name)) throw `${current}: there can't be two literals with the same text.`;
				literals.push(possible.name);
			} else if (members.length > 1) {
				if (['str', 'string'].includes(possible.type) && members.length - 1 !== i) throw `${current}: the String type is vague, you must specify it at the last bound`;
				if (types.includes(possible.type)) throw `${current}: there can't be two bounds with the same type (${possible.type})`;
				types.push(possible.type);
			}
			return possible;
		});
	}

	/**
	 * Parses raw members true members
	 * @since 0.2.1
	 * @param members The tag contents to parse
	 */
	private static parseTrueMembers(members: string): string[] {
		const trueMembers = [];
		let regex = false;
		let current = '';
		for (const char of members) {
			if (char === '/') regex = !regex;
			if (char !== '|' || regex) {
				current += char;
			} else {
				trueMembers.push(current);
				current = '';
			}
		}
		trueMembers.push(current);
		return trueMembers;
	}

	/**
	 * Standard regular expressions for matching usage tags
	 * @since 0.5.0
	 */
	private static pattern = /^([^:]+)(?::([^{}/]+))?(?:{([^,]+)?,?([^}]+)?})?(?:\/(.+)\/(\w+)?)?$/i;

}
