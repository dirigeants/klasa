import { mergeDefault } from '@klasa/utils';
import { Cache } from '@klasa/cache';

import type { KlasaUser } from '../extensions/KlasaUser';
import type { TextBasedChannel, MessageOptions } from '@klasa/core';
import { Usage } from './Usage';
import { KlasaMessage } from '../extensions/KlasaMessage';
import { CommandUsage } from './CommandUsage';
import { Tag, TagRequirement } from './Tag';
import { KlasaClient } from '../Client';
const quotes = ['"', "'", '“”', '‘’'];

export interface TextPromptOptions {
	/**
	 * The intended target of this TextPrompt, if someone other than the author.
	 * @default message.author
	 */
	target?: KlasaUser;

	/**
	 * The channel to prompt in, if other than this channel.
	 * @default message.channel
	 */
	channel?: TextBasedChannel;

	/**
	 * The number of re-prompts before this TextPrompt gives up.
	 * @default Infinity
	 */
	limit?: number;

	/**
	 * The time-limit for re-prompting.
	 * @default 30000
	 */
	time?: number;

	/**
	 * Whether this prompt should respect quoted strings.
	 * @default false
	 */
	quotedStringSupport?: boolean;

	/**
	 * Whether this prompt should respect flags.
	 * @default true
	 */
	flagSupport?: boolean;
}

/**
 * A class to handle argument collection and parameter resolution
 */
export class TextPrompt {

	/**
	 * The client this TextPrompt was created with
	 * @since 0.5.0
	 */
	public readonly client!: KlasaClient;

	/**
	 * The message this prompt is for
	 * @since 0.5.0
	 */
	public message: KlasaMessage;

	/**
	 * The target this prompt is for
	 * @since 0.5.0
	 */
	public target: KlasaUser;

	/**
	 * The channel to prompt in
	 * @since 0.5.0
	 */
	public channel: TextBasedChannel;

	/**
	 * The usage for this prompt
	 * @since 0.5.0
	 */
	public usage: Usage | CommandUsage;

	/**
	 * If the command reprompted for missing args
	 * @since 0.0.1
	 */
	public reprompted = false;

	/**
	 * The flag arguments resolved by this class
	 * @since 0.5.0
	 */
	public flags: Record<string, string> = {};

	/**
	 * The string arguments derived from the usageDelim of the command
	 * @since 0.0.1
	 */
	public args: (string | null)[] = [];

	/**
	 * The parameters resolved by this class
	 * @since 0.0.1
	 */
	public params: unknown[] = [];

	/**
	 * The time-limit for re-prompting
	 * @since 0.5.0
	 */
	public time: number;

	/**
	 * The number of re-prompts before this TextPrompt gives up
	 * @since 0.5.0
	 */
	public limit: number;

	/**
	 * Whether this prompt should respect quoted strings
	 * @since 0.5.0
	 */
	public quotedStringSupport: boolean;

	/**
	 * Whether this prompt should respect flags
	 * @since 0.5.0
	 */
	public flagSupport: boolean;

	/**
	 * A cache of the users responses
	 * @since 0.5.0
	 */
	public responses = new Cache<string, KlasaMessage>();

	/**
	 * Whether the current usage is a repeating arg
	 * @since 0.0.1
	 */
	#repeat = false;

	/**
	 * Whether the current usage is required
	 * @since 0.0.1
	 */
	#required = TagRequirement.Optional;

	/**
	 * How many time this class has reprompted
	 * @since 0.0.1
	 */
	#prompted = 0;

	/**
	 * A cache of the current usage while validating
	 * @since 0.0.1
	 */
	#currentUsage: Tag | null = null;

	/**
	 * @since 0.5.0
	 * @param message The message this prompt is for
	 * @param usage The usage for this prompt
	 * @param options The options of this prompt
	 */
	constructor(message: KlasaMessage, usage: Usage, options: TextPromptOptions = {}) {
		options = mergeDefault(message.client.options.customPromptDefaults, options);
		Object.defineProperty(this, 'client', { value: message.client });
		this.message = message;
		this.target = options.target || message.author;
		this.channel = options.channel || message.channel;
		this.usage = usage;
		this.time = options.time as number;
		this.limit = options.limit as number;
		this.quotedStringSupport = options.quotedStringSupport as boolean;
		this.flagSupport = options.flagSupport as boolean;
	}

	/**
	 * Runs the custom prompt.
	 * @since 0.5.0
	 * @param prompt The message to initially prompt with
	 * @returns The parameters resolved
	 */
	public async run(prompt: MessageOptions): Promise<unknown[]> {
		const message = await this.prompt(prompt);
		this.responses.set(message.id, message);
		this._setup(message.content);
		return this.validateArgs();
	}

	/**
	 * Prompts the target for a response
	 * @since 0.5.0
	 * @param text The text to prompt
	 */
	private async prompt(text: MessageOptions): Promise<KlasaMessage> {
		const [message] = await this.channel.send(text);
		const responses = await message.channel.awaitMessages({ idle: this.time, limit: 1, filter: msg => msg.author === this.target });
		message.delete();
		if (responses.size === 0) throw this.message.language.get('MESSAGE_PROMPT_TIMEOUT');
		return responses.firstValue as KlasaMessage;
	}

	/**
	 * Collects missing required arguments.
	 * @since 0.5.0
	 * @param prompt The reprompt error
	 */
	public async reprompt(prompt: string): Promise<unknown[]> {
		this.#prompted++;
		if (this.typing) this.message.channel.typing.stop();
		const possibleAbortOptions = this.message.language.get('TEXT_PROMPT_ABORT_OPTIONS');
		const edits = this.message.edits.length;
		const message = await this.prompt(
			this.message.language.get('MONITOR_COMMAND_HANDLER_REPROMPT', `<@!${this.target.id}>`, prompt, this.time / 1000, possibleAbortOptions)
		);
		if (this.message.edits.length !== edits || message.prefix || possibleAbortOptions.includes(message.content.toLowerCase())) throw this.message.language.get('MONITOR_COMMAND_HANDLER_ABORTED');

		this.responses.set(message.id, message);

		if (this.typing) this.message.channel.typing.start();
		this.args[this.args.lastIndexOf(null)] = message.content;
		this.reprompted = true;

		if (this.usage.parsedUsage[this.params.length].repeat) return this.repeatingPrompt();
		return this.validateArgs();
	}

	/**
	 * Collects repeating arguments.
	 * @since 0.5.0
	 */
	private async repeatingPrompt(): Promise<unknown[]> {
		if (this.typing) this.message.channel.typing.stop();
		let message;
		const possibleCancelOptions = this.message.language.get('TEXT_PROMPT_ABORT_OPTIONS');
		try {
			message = await this.prompt(
				this.message.language.get('MONITOR_COMMAND_HANDLER_REPEATING_REPROMPT', `<@!${this.message.author.id}>`, this.#currentUsage.possibles[0].name, this.time / 1000, possibleCancelOptions)
			);
			this.responses.set(message.id, message);
		} catch (err) {
			return this.validateArgs();
		}

		if (possibleCancelOptions.includes(message.content.toLowerCase())) return this.validateArgs();

		if (this.typing) this.message.channel.typing.start();
		this.args.push(message.content);
		this.reprompted = true;

		return this.repeatingPrompt();
	}

	/**
	 * Validates and resolves args into parameters
	 * @since 0.0.1
	 * @returns The resolved parameters
	 */
	protected async validateArgs(): Promise<unknown[]> {
		if (this.params.length >= this.usage.parsedUsage.length && this.params.length >= this.args.length) {
			return this.finalize();
		} else if (this.usage.parsedUsage[this.params.length]) {
			this.#currentUsage = this.usage.parsedUsage[this.params.length];
			this.#required = this.#currentUsage.required;
		} else if (this.#currentUsage.repeat) {
			this.#required = 0;
			this.#repeat = true;
		} else {
			return this.finalize();
		}

		this.#prompted = 0;
		return this.multiPossibles(0);
	}

	/**
	 * Validates and resolves args into parameters, when multiple types of usage is defined
	 * @since 0.0.1
	 * @param index The id of the possible usage currently being checked
	 * @returns The resolved parameters
	 */
	private async multiPossibles(index: number): Promise<unknown[]> {
		const possible = this.#currentUsage.possibles[index];
		const custom = this.usage.customResolvers[possible.type];
		const resolver = this.client.arguments.get(custom ? 'custom' : possible.type);

		if (possible.name in this.flags) this.args.splice(this.params.length, 0, this.flags[possible.name]);
		if (!resolver) {
			this.client.emit('warn', `Unknown Argument Type encountered: ${possible.type}`);
			if (this.#currentUsage.possibles.length === 1) return this.pushParam(undefined);
			return this.multiPossibles(++index);
		}

		try {
			const res = await resolver.run(this.args[this.params.length], possible, this.message, custom);
			if (typeof res === 'undefined' && this.#required === 1) this.args.splice(this.params.length, 0, undefined);
			return this.pushParam(res);
		} catch (err) {
			if (index < this.#currentUsage.possibles.length - 1) return this.multiPossibles(++index);
			if (!this.#required) {
				this.args.splice(...this.#repeat ? [this.params.length, 1] : [this.params.length, 0, undefined]);
				return this.#repeat ? this.validateArgs() : this.pushParam(undefined);
			}

			const { response } = this.#currentUsage;
			const error = typeof response === 'function' ? response(this.message, possible) : response;

			if (this.#required === 1) return this.handleError(error || err);
			if (this.#currentUsage.possibles.length === 1) {
				return this.handleError(error || (this.args[this.params.length] === undefined ? this.message.language.get('COMMANDMESSAGE_MISSING_REQUIRED', possible.name) : err));
			}
			return this.handleError(error || this.message.language.get('COMMANDMESSAGE_NOMATCH', this.#currentUsage.possibles.map(poss => poss.name).join(', ')));
		}
	}

	/**
	 * Pushes a parameter into this.params, and resets the re-prompt count.
	 * @since 0.5.0
	 * @param param The resolved parameter
	 */
	private pushParam(param: unknown): Promise<unknown[]> {
		this.params.push(param);
		return this.validateArgs();
	}

	/**
	 * Decides if the prompter should reprompt or throw the error found while validating.
	 * @since 0.5.0
	 * @param err The error found while validating
	 */
	private async handleError(err: string): Promise<unknown[]> {
		this.args.splice(this.params.length, 1, null);
		if (this.limit && this.#prompted < this.limit) return this.reprompt(err);
		throw err;
	}

	/**
	 * Finalizes parameters and arguments for this prompt.
	 * @since 0.5.0
	 */
	private finalize(): unknown[] {
		for (let i = this.params.length - 1; i >= 0 && this.params[i] === undefined; i--) this.params.pop();
		for (let i = this.args.length - 1; i >= 0 && this.args[i] === undefined; i--) this.args.pop();
		return this.params;
	}

	/**
	 * Splits the original message string into arguments.
	 * @since 0.5.0
	 * @param original The original message string
	 */
	private _setup(original: string): void {
		const { content, flags } = this.flagSupport ? (this.constructor as typeof TextPrompt).getFlags(original, this.usage.usageDelim) : { content: original, flags: {} };
		this.flags = flags;
		this.args = this.quotedStringSupport ?
			(this.constructor as typeof TextPrompt).getQuotedStringArgs(content, this.usage.usageDelim).map(arg => arg.trim()) :
			(this.constructor as typeof TextPrompt).getArgs(content, this.usage.usageDelim).map(arg => arg.trim());
	}

	/**
	 * Parses a message into string args
	 * @since 0.5.0
	 * @param content The remaining content
	 * @param delim The delimiter
	 */
	private static getFlags(content: string, delim: string): { content: string, flags: Record<string, string> } {
		const flags: Record<string, string> = {};
		content = content.replace(this.flagRegex, (_match, fl, ...quote) => {
			flags[fl] = (quote.slice(0, -2).find(el => el) || fl).replace(/\\/g, '');
			return '';
		});
		if (delim) content = content.replace(this.delims.get(delim) || this.generateNewDelim(delim), '$1').trim();
		return { content, flags };
	}

	/**
	 * Parses a message into string args
	 * @since 0.0.1
	 * @param content The remaining content
	 * @param delim The delimiter
	 */
	private static getArgs(content: string, delim: string): string[] {
		const args = content.split(delim !== '' ? delim : undefined);
		return args.length === 1 && args[0] === '' ? [] : args;
	}

	/**
	 * Parses a message into string args taking into account quoted strings
	 * @since 0.0.1
	 * @param content The remaining content
	 * @param delim The delimiter
	 */
	private static getQuotedStringArgs(content: string, delim: string): string[] {
		if (!delim || delim === '') return [content];

		const args = [];

		for (let i = 0; i < content.length; i++) {
			let current = '';
			if (content.slice(i, i + delim.length) === delim) {
				i += delim.length - 1;
				continue;
			}
			const quote = quotes.find(qt => qt.includes(content[i]));
			if (quote) {
				const qts = quote.split('');
				while (i + 1 < content.length && (content[i] === '\\' || !qts.includes(content[i + 1]))) current += content[++i] === '\\' && qts.includes(content[i + 1]) ? '' : content[i];
				i++;
				args.push(current);
			} else {
				current += content[i];
				while (i + 1 < content.length && content.slice(i + 1, i + delim.length + 1) !== delim) current += content[++i];
				args.push(current);
			}
		}

		return args.length === 1 && args[0] === '' ? [] : args;
	}

	/**
	 * Generate a new delimiter's RegExp and cache it
	 * @since 0.5.0
	 * @param delim The delimiter
	 */
	private static generateNewDelim(delim: string): RegExp {
		const regex = new RegExp(`(${delim})(?:${delim})+`, 'g');
		this.delims.set(delim, regex);
		return regex;
	}

	/**
	 * Map of RegExps caching usageDelim's RegExps.
	 * @since 0.5.0
	 */
	public static delims = new Cache<string, RegExp>();

	/**
	 * Regular Expression to match flags with quoted string support.
	 * @since 0.5.0
	 */
	public static flagRegex = new RegExp(`(?:--|—)(\\w[\\w-]+)(?:=(?:${quotes.map(qu => `[${qu}]((?:[^${qu}\\\\]|\\\\.)*)[${qu}]`).join('|')}|([\\w<>@#&!-]+)))?`, 'g');

}
