import { Cache } from '@klasa/cache';
import { Tag, TagRequirement, TagResponse } from './Tag';
import { TextPrompt, TextPromptOptions } from './TextPrompt';

import type { Client, Message } from '@klasa/core';
import type { Possible } from './Possible';

const open = ['[', '(', '<'];
const close = [']', ')', '>'];
const space = [' ', '\n'];

/**
 * Converts usage strings into objects to compare against later
 */
export class Usage {

	/**
	 * The client this Usage was created with
	 * @since 0.0.1
	 */
	public readonly client!: Client;

	/**
	 * The usage string re-deliminated with the usageDelim
	 * @since 0.0.1
	 */
	public deliminatedUsage: string;

	/**
	 * The usage string
	 * @since 0.0.1
	 */
	public usageString: string;

	/**
	 * The usage delim
	 * @since 0.5.0
	 */
	public usageDelim: string;

	/**
	 * The usage object to compare against later
	 * @since 0.0.1
	 */
	public parsedUsage: Tag[];

	/**
	 * Stores one-off custom resolvers for use with the custom type arg
	 * @since 0.5.0
	 */
	public customResolvers = new Cache<string, CustomUsageArgument>();

	/**
	 * @since 0.0.1
	 * @param client The klasa client
	 * @param usageString The raw usage string
	 * @param usageDelim The deliminator for this usage
	 */
	constructor(client: Client, usageString: string, usageDelim: string) {
		Object.defineProperty(this, 'client', { value: client });
		this.deliminatedUsage = usageString !== '' ? ` ${usageString.split(' ').join(usageDelim)}` : '';
		this.usageString = usageString;
		this.usageDelim = usageDelim;
		this.parsedUsage = (this.constructor as typeof Usage).parseUsage(this.usageString);
	}

	/**
	 * Registers a one-off custom resolver
	 * @since 0.5.0
	 * @param type The type of the usage argument
	 * @param resolver The one-off custom resolver
	 * @chainable
	 */
	public createCustomResolver(type: string, resolver: CustomUsageArgument): this {
		this.customResolvers.set(type, resolver);
		return this;
	}

	/**
	 * Customizes the response of an argument if it fails resolution.
	 * @since 0.5.0
	 * @param name The name of the usage argument
	 * @param response The custom response or i18n function
	 * @chainable
	 */
	public customizeResponse(name: string, response: string | TagResponse): this {
		this.parsedUsage.some(tag => tag.register(name, response));
		return this;
	}

	/**
	 * Creates a TextPrompt instance to collect and resolve arguments with.
	 * @since 0.5.0
	 * @param message The message context from the prompt
	 * @param options The options for the prompt
	 */
	public createPrompt(message: Message, options: TextPromptOptions = {}): TextPrompt {
		return new TextPrompt(message, this, options);
	}

	/**
	 * Defines json stringify behavior of this class.
	 * @since 0.5.0
	 */
	public toJSON(): Tag[] {
		return this.parsedUsage;
	}

	/**
	 * Defines to string behavior of this class.
	 * @since 0.5.0
	 */
	public toString(): string {
		return this.deliminatedUsage;
	}

	/**
	 * Method responsible for building the usage object to check against
	 * @since 0.0.1
	 * @param usageString The usage string to parse
	 */
	private static parseUsage(usageString: string): Tag[] {
		const usage: UsageContext = {
			tags: [],
			opened: 0,
			current: '',
			openRegex: false,
			openReq: TagRequirement.Optional,
			last: false,
			char: 0,
			from: 0,
			at: '',
			fromTo: ''
		};

		for (let i = 0; i < usageString.length; i++) {
			const char = usageString[i];
			usage.char = i + 1;
			usage.from = usage.char - usage.current.length;
			usage.at = `at char #${usage.char} '${char}'`;
			usage.fromTo = `from char #${usage.from} to #${usage.char} '${usage.current}'`;

			if (usage.last && char !== ' ') throw `${usage.at}: there can't be anything else after the repeat tag.`;

			if (char === '/' && usage.current[usage.current.length - 1] !== '\\') usage.openRegex = !usage.openRegex;

			if (usage.openRegex) {
				usage.current += char;
				continue;
			}

			if (open.includes(char)) this.tagOpen(usage, char);
			else if (close.includes(char)) this.tagClose(usage, char);
			else if (space.includes(char)) this.tagSpace(usage, char);
			else usage.current += char;
		}

		if (usage.opened) throw `from char #${usageString.length - usage.current.length} '${usageString.substr(-usage.current.length - 1)}' to end: a tag was left open`;
		if (usage.current) throw `from char #${(usageString.length + 1) - usage.current.length} to end '${usage.current}' a literal was found outside a tag.`;

		return usage.tags;
	}

	/**
	 * Method responsible for handling tag opens
	 * @since 0.0.1
	 * @param usage The current usage interim object
	 * @param char The character that triggered this function
	 */
	private static tagOpen(usage: UsageContext, char: string): void {
		if (usage.opened) throw `${usage.at}: you may not open a tag inside another tag.`;
		if (usage.current) throw `${usage.fromTo}: there can't be a literal outside a tag`;
		usage.opened++;
		usage.openReq = open.indexOf(char);
	}

	/**
	 * Method responsible for handling tag closes
	 * @since 0.0.1
	 * @param usage The current usage interim object
	 * @param char The character that triggered this function
	 */
	static tagClose(usage: UsageContext, char: string): void {
		const required = close.indexOf(char);
		if (!usage.opened) throw `${usage.at}: invalid close tag found`;
		if (usage.openReq !== required) throw `${usage.at}: Invalid closure of '${open[usage.openReq]}${usage.current}' with '${close[required]}'`;
		if (!usage.current) throw `${usage.at}: empty tag found`;
		usage.opened--;
		if (usage.current === '...') {
			if (usage.openReq) throw `${usage.at}: repeat tag cannot be required`;
			if (usage.tags.length < 1) throw `${usage.fromTo}: there can't be a repeat at the beginning`;
			usage.tags[usage.tags.length - 1].repeat = true;
			usage.last = true;
		} else {
			usage.tags.push(new Tag(usage.current, usage.tags.length + 1, required));
		}
		usage.current = '';
	}

	/**
	 * Method responsible for handling tag spacing
	 * @since 0.0.1
	 * @param usage The current usage interim object
	 * @param char The character that triggered this function
	 */
	private static tagSpace(usage: UsageContext, char: string): void {
		if (char === '\n') throw `${usage.at}: there can't be a line break in the usage string`;
		if (usage.opened) throw `${usage.at}: spaces aren't allowed inside a tag`;
		if (usage.current) throw `${usage.fromTo}: there can't be a literal outside a tag.`;
	}

}

export interface CustomUsageArgument {
	/**
	 * @since 0.5.0
	 * @param argument The argument to be parsed.
	 * @param possible The {@link Possible tag member} this argument belongs to.
	 * @param message The message that is being parsed.
	 * @param params The parsed parameters from the previous arguments.
	 */
	(argument: string, possible: Possible, message: Message, params: unknown[]): unknown | Promise<unknown>;
}

interface UsageContext {
	tags: Tag[];
	opened: number;
	current: string;
	openRegex: boolean;
	openReq: TagRequirement;
	last: boolean;
	char: number;
	from: number;
	at: string;
	fromTo: string;
}
