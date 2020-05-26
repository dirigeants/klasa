/* eslint-disable no-dupe-class-members */
import { extender, MessageBuilder, Message, MessageOptions, SplitOptions } from '@klasa/core';
import { Cache } from '@klasa/cache';
import { regExpEsc } from '@klasa/utils';

import type { Command } from '../structures/Command';
import { APIMessageData, ChannelType } from '@klasa/dapi-types';
import { Language } from '../structures/Language';
import { KlasaGuild } from './KlasaGuild';
import { CommandPrompt } from '../usage/CommandPrompt';
import { Gateway } from '../settings/gateway/Gateway';
import { Settings } from '../settings/Settings';

export interface CachedPrefix {
	length: number;
	regex: RegExp | null;
}

/**
 * Klasa's Extended Message
 */
export class KlasaMessage extends extender.get('Message') {

	/**
	 * The command being ran.
	 */
	public command!: Command | null;

	/**
	 * The name of the command being ran.
	 */

	public commandText!: string | null;

	/**
	 * The prefix used.
	 */
	public prefix!: RegExp | null;

	/**
	 * The length of the prefix used.
	 */
	public prefixLength!: number | null;

	/**
	 * The language for this message.
	 */
	public language!: Language;

	/**
	 * The guild level settings for this context (guild || default)
	 */
	public guildSettings!: Settings;

	/**
	 * A command prompt/argument handler.
	 */
	private prompter!: CommandPrompt | null;

	/**
	 * All of the responses to this message.
	 */
	#responses: Message[];

	public constructor(...args: any[]) {
		super(...args);

		this.command = this.command || null;
		this.commandText = this.commandText || null;
		this.prefix = this.prefix || null;
		this.prefixLength = this.prefixLength || null;
		this.prompter = this.prompter || null;
		this.#responses = [];
	}

	/**
	* The previous responses to this message
	* @since 0.5.0
	*/
	public get responses(): Message[] {
		return this.#responses.filter(msg => !msg.deleted);
	}

	/**
	* The string arguments derived from the usageDelim of the command
	* @since 0.0.1
	*/
	public get args(): (string | undefined | null)[] {
		return this.prompter ? this.prompter.args : [];
	}

	/**
	* The parameters resolved by this class
	* @since 0.0.1
	*/
	public get params(): unknown[] {
		return this.prompter ? this.prompter.params : [];
	}

	/**
	* The flags resolved by this class
	* @since 0.5.0
	*/
	public get flagArgs(): Record<string, string> {
		return this.prompter ? this.prompter.flags : {};
	}

	/**
	* If the command reprompted for missing args
	* @since 0.0.1
	*/
	public get reprompted(): boolean {
		return this.prompter ? this.prompter.reprompted : false;
	}

	/**
	* The usable commands by the author in this message's context
	* @since 0.0.1
	*/
	public async usableCommands(): Promise<Cache<string, Command>> {
		const col = new Cache<string, Command>();
		await Promise.all(this.client.commands.map((command) =>
			this.client.inhibitors.run(this, command, true)
				.then(() => { col.set(command.name, command); })
				.catch(() => {
					// noop
				})
		));
		return col;
	}

	/**
	* Checks if the author of this message, has applicable permission in this message's context of at least min
	* @since 0.0.1
	*/
	public async hasAtLeastPermissionLevel(min: number): Promise<boolean> {
		const { permission } = await this.client.permissionLevels.run(this, min);
		return permission;
	}

	/**
	 * Sends a message to the channel.
	 * @param data The {@link MessageBuilder builder} to send.
	 * @param options The split options for the message.
	 * @since 0.0.1
	 * @see https://discord.com/developers/docs/resources/channel#create-message
	 * @example
	 * message.send(new MessageBuilder()
	 *     .setContent('Ping!')
	 *     .setEmbed(new Embed().setDescription('From an embed!')));
	 */
	public send(data: MessageOptions, options?: SplitOptions): Promise<Message[]>;
	/**
	 * Sends a message to the channel.
	 * @param data A callback with a {@link MessageBuilder builder} as an argument.
	 * @param options The split options for the message.
	 * @since 0.0.1
	 * @see https://discord.com/developers/docs/resources/channel#create-message
	 * @example
	 * message.send(builder => builder
	 *     .setContent('Ping!')
	 *     .setEmbed(embed => embed.setDescription('From an embed!')));
	 */
	public send(data: (message: MessageBuilder) => MessageBuilder | Promise<MessageBuilder>, options?: SplitOptions): Promise<Message[]>;
	public async send(data: MessageOptions | ((message: MessageBuilder) => MessageBuilder | Promise<MessageBuilder>), options: SplitOptions = {}): Promise<Message[]> {
		const split = (typeof data === 'function' ? await data(new MessageBuilder()) : new MessageBuilder(data)).split(options);

		const { responses } = this;
		const promises = [];
		const deletes = [];
		const max = Math.max(split.length, responses.length);

		for (let i = 0; i < max; i++) {
			if (i >= split.length) deletes.push(responses[i].delete());
			else if (responses.length > i) promises.push(responses[i].edit(split[i]));
			else promises.push(this.channel.send(split[i]).then(([message]: Message[]): Message => message));
		}

		this.#responses = await Promise.all(promises) as Message[];
		await Promise.all(deletes);

		return this.#responses.slice(0);
	}

	/**
	 * Sends a message that will be editable via command editing (if nothing is attached)
	 * @since 0.5.0
	 * @param key The Language key to send
	 * @param options The split options
	 */
	public sendLocale(key: string, options?: SplitOptions): Promise<Message[]>;
	/**
	 * Sends a message that will be editable via command editing (if nothing is attached)
	 * @since 0.5.0
	 * @param key The Language key to send
	 * @param localeArgs The language arguments to pass
	 * @param options The split options
	 */
	public sendLocale(key: string, localeArgs?: unknown[], options?: SplitOptions): Promise<Message[]>;
	public sendLocale(key: string, localeArgs: unknown[] | SplitOptions = [], options?: SplitOptions): Promise<Message[]> {
		if (!Array.isArray(localeArgs)) [options, localeArgs] = [localeArgs, []];
		return this.send(mb => mb.setContent(this.language.get(key, ...localeArgs as unknown[])), options);
	}

	/**
	 * Extends the patch method from Message to attach and update the language to this instance
	 * @since 0.5.0
	 */
	protected _patch(data: Partial<APIMessageData>): this {
		super._patch(data);

		this.language = this.guild ? (this.guild as KlasaGuild).language : this.client.languages.default;

		this.guildSettings = this.guild ? this.guild.settings : (this.client.gateways.get('guilds') as Gateway).schema.defaults as Settings;

		this._parseCommand();
		return this;
	}

	/**
	* Parses this message as a command
	* @since 0.5.0
	*/
	private _parseCommand(): void {
		// Clear existing command state so edits to non-commands do not re-run commands
		this.prefix = null;
		this.prefixLength = null;
		this.commandText = null;
		this.command = null;
		this.prompter = null;

		try {
			const prefix = this._mentionPrefix() || this._customPrefix() || this._naturalPrefix() || this._prefixLess();

			if (!prefix) return;

			this.prefix = prefix.regex;
			this.prefixLength = prefix.length;
			this.commandText = this.content.slice(prefix.length).trim().split(' ')[0].toLowerCase();
			this.command = this.client.commands.get(this.commandText) || null;

			if (!this.command) return;

			this.prompter = this.command.usage.createPrompt(this, {
				flagSupport: this.command.flagSupport,
				quotedStringSupport: this.command.quotedStringSupport,
				time: this.command.promptTime,
				limit: this.command.promptLimit
			});
		} catch (error) {
			return;
		}
	}

	/**
	* Checks if the per-guild or default prefix is used
	* @since 0.5.0
	*/
	private _customPrefix(): CachedPrefix | null {
		const prefix = this.guildSettings.get('prefix');
		if (!prefix) return null;
		for (const prf of Array.isArray(prefix) ? prefix : [prefix]) {
			const testingPrefix = KlasaMessage.prefixes.get(prf) || KlasaMessage.generateNewPrefix(prf, this.client.options.commands.prefixCaseInsensitive ? 'i' : '');
			if (testingPrefix.regex.test(this.content)) return testingPrefix;
		}
		return null;
	}

	/**
	* Checks if the mention was used as a prefix
	* @since 0.5.0
	*/
	private _mentionPrefix(): CachedPrefix | null {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const mentionPrefix = this.client.mentionPrefix!.exec(this.content);
		return mentionPrefix ? { length: mentionPrefix[0].length, regex: this.client.mentionPrefix } : null;
	}

	/**
	* Checks if the natural prefix is used
	* @since 0.5.0
	*/
	private _naturalPrefix(): CachedPrefix | null {
		if (this.guildSettings.get('disableNaturalPrefix') || !this.client.options.commands.regexPrefix) return null;
		const results = this.client.options.commands.regexPrefix.exec(this.content);
		return results ? { length: results[0].length, regex: this.client.options.commands.regexPrefix } : null;
	}

	/**
	* Checks if a prefixless scenario is possible
	* @since 0.5.0
	*/
	private _prefixLess(): CachedPrefix | null {
		return this.client.options.commands.noPrefixDM && this.channel.type === ChannelType.DM ? { length: 0, regex: null } : null;
	}

	/**
	* Caches a new prefix regexp
	* @since 0.5.0
	*/
	private static generateNewPrefix(prefix: string, flags: string): CachedPrefix {
		const prefixObject = { length: prefix.length, regex: new RegExp(`^${regExpEsc(prefix)}`, flags) };
		this.prefixes.set(prefix, prefixObject);
		return prefixObject;
	}

	/**
	* Cache of RegExp prefixes
	* @since 0.5.0
	*/
	private static prefixes = new Map();

}

extender.extend('Message', () => KlasaMessage);
