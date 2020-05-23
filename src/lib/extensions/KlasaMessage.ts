import { extender, MessageBuilder, Permissions } from '@klasa/core';
import { Cache } from '@klasa/cache';
import { regExpEsc } from '@klasa/utils';

import type { Command } from '../structures/Command';
import { APIMessageData, ChannelType } from '@klasa/dapi-types';
import { KlasaClient } from '../Client';
import { Language } from '../structures/Language';
import { Settings } from '../settings/Settings';
import { KlasaGuild } from './KlasaGuild';
import { CommandPrompt } from '../usage/CommandPrompt';

export interface CachedPrefix {
	length: number;
	regex: RegExp | null;
}

/**
* Klasa's Extended Message
* @extends external:Message
*/
export class KlasaMessage extends extender.get('Message') {

	/**
	 * The command being ran.
	 */
	public command: Command | null;

	/**
	 * The name of the command being ran.
	 */

	public commandText: string | null;

	/**
	 * The prefix used.
	 */
	public prefix: RegExp | null;

	/**
	 * The length of the prefix used.
	 */
	public prefixLength: number | null;

	/**
	 * The language for this message.
	 */
	public language: Language | null;

	/**
	 * The guild level settings for this context (guild || default)
	 */
	public guildSettings: Settings;

	/**
	 * A command prompt/argument handler.
	 */
	private prompter: CommandPrompt | null;

	/**
	 * All of the responses to this message.
	 */
	private readonly _responses: KlasaMessage[];

	public constructor(...args: any[]) {
		super(...args);

		this.command = this.command || null;
		this.commandText = this.commandText || null;
		this.prefix = this.prefix || null;
		this.prefixLength = this.prefixLength || null;
		this.language = this.language || null;
		// todo: This should/will eventually be mapped. (this.client.gateways.get('guilds').defaults)
		this.guildSettings = this.guild ? (this.guild as KlasaGuild).settings : (this.client as KlasaClient).gateways.guilds.defaults;
		this.prompter = this.prompter || null;
		this._responses = [];
	}

	/**
	* The previous responses to this message
	* @since 0.5.0
	*/
	get responses(): KlasaMessage[] {
		return this._responses.filter(msg => !msg.deleted);
	}

	/**
	* The string arguments derived from the usageDelim of the command
	* @since 0.0.1
	*/
	get args(): string[] {
		return this.prompter ? this.prompter.args : [];
	}

	/**
	* The parameters resolved by this class
	* @since 0.0.1
	*/
	get params(): any[] {
		return this.prompter ? this.prompter.params : [];
	}

	/**
	* The flags resolved by this class
	* @since 0.5.0
	*/
	get flagArgs(): object {
		return this.prompter ? this.prompter.flags : {};
	}

	/**
	* If the command reprompted for missing args
	* @since 0.0.1
	*/
	get reprompted(): boolean {
		return this.prompter ? this.prompter.reprompted : false;
	}

	/**
	* If this message can be reacted to by the bot
	* @since 0.0.1
	* @type {boolean}
	* @readonly
	*/
	get reactable() {
		if (!this.guild) return true;
		return this.channel.readable && this.channel.permissionsFor(this.guild.me).has([FLAGS.ADD_REACTIONS, FLAGS.READ_MESSAGE_HISTORY], false);
	}

	/**
	* The usable commands by the author in this message's context
	* @since 0.0.1
	*/
	async usableCommands(): Promise<Cache<string, Command>> {
		const col = new Cache<string, Command>();
		await Promise.all((this.client as KlasaClient).commands.map((command) =>
			(this.client as KlasaClient).inhibitors.run(this, command, true)
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
	async hasAtLeastPermissionLevel(min: number): Promise<boolean> {
		const { permission } = await (this.client as KlasaClient).permissionLevels.run(this, min);
		return permission;
	}

	/**
	* Sends a message that will be editable via command editing (if nothing is attached)
	* @since 0.0.1
	* @param {external:StringResolvable|external:MessageEmbed|external:MessageAttachment} [content] The content to send
	* @param {external:MessageOptions} [options] The D.JS message options
	* @returns {KlasaMessage|KlasaMessage[]}
	*/
	async sendMessage(content, options) {
		const combinedOptions = APIMessage.transformOptions(content, options);

		if ('files' in combinedOptions) return this.channel.send(combinedOptions);

		const newMessages = new APIMessage(this.channel, combinedOptions).resolveData().split()
			.map(mes => {
				// Command editing should always remove embeds and content if none is provided
				mes.data.embed = mes.data.embed || null;
				mes.data.content = mes.data.content || null;
				return mes;
			});

		const { responses } = this;
		const promises = [];
		const max = Math.max(newMessages.length, responses.length);

		for (let i = 0; i < max; i++) {
			if (i >= newMessages.length) responses[i].delete();
			else if (responses.length > i) promises.push(responses[i].edit(newMessages[i]));
			else promises.push(this.channel.send(newMessages[i]));
		}

		const newResponses = await Promise.all(promises);

		// Can't store the clones because deleted will never be true
		this._responses = newMessages.map((val, i) => responses[i] || newResponses[i]);

		return newResponses.length === 1 ? newResponses[0] : newResponses;
	}

	/**
	* Sends an embed message that will be editable via command editing (if nothing is attached)
	* @since 0.0.1
	* @param {external:MessageEmbed} embed The embed to post
	* @param {external:StringResolvable} [content] The content to send
	* @param {external:MessageOptions} [options] The D.JS message options
	* @returns {Promise<KlasaMessage|KlasaMessage[]>}
	*/
	sendEmbed(embed, content, options) {
		return this.sendMessage(APIMessage.transformOptions(content, options, { embed }));
	}

	/**
	* Sends a codeblock message that will be editable via command editing (if nothing is attached)
	* @since 0.0.1
	* @param {string} code The language of the codeblock
	* @param {external:StringResolvable} content The content to send
	* @param {external:MessageOptions} [options] The D.JS message options
	* @returns {Promise<KlasaMessage|KlasaMessage[]>}
	*/
	sendCode(code, content, options) {
		return this.sendMessage(APIMessage.transformOptions(content, options, { code }));
	}

	/**
	* Sends a message that will be editable via command editing (if nothing is attached)
	* @since 0.0.1
	* @param {external:StringResolvable|external:MessageEmbed|external:MessageAttachment} [content] The content to send
	* @param {external:MessageOptions} [options] The D.JS message options
	* @returns {Promise<KlasaMessage|KlasaMessage[]>}
	*/
	send(content, options) {
		return this.sendMessage(content, options);
	}

	/**
	* Sends a message that will be editable via command editing (if nothing is attached)
	* @since 0.5.0
	* @param {string} key The Language key to send
	* @param {Array<*>} [localeArgs] The language arguments to pass
	* @param {external:MessageOptions} [options] The D.JS message options plus Language arguments
	* @returns {Promise<KlasaMessage|KlasaMessage[]>}
	*/
	sendLocale(key, localeArgs = [], options = {}) {
		if (!Array.isArray(localeArgs)) [options, localeArgs] = [localeArgs, []];
		return this.sendMessage(APIMessage.transformOptions(this.language.get(key, ...localeArgs), undefined, options));
	}
	/**
	 * Extends the patch method from Message to attach and update the language to this instance
	 * @since 0.5.0
	 */
	protected _patch(data: Partial<APIMessageData>): this {
		super._patch(data);

		this.language = this.guild ? (this.guild as KlasaGuild).language : (this.client as KlasaClient).languages.default;

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
			this.command = (this.client as KlasaClient).commands.get(this.commandText) || null;

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
		if (!this.guildSettings.prefix) return null;
		for (const prf of Array.isArray(this.guildSettings.prefix) ? this.guildSettings.prefix : [this.guildSettings.prefix]) {
			const testingPrefix = KlasaMessage.prefixes.get(prf) || KlasaMessage.generateNewPrefix(prf, this.client.options.prefixCaseInsensitive ? 'i' : '');
			if (testingPrefix.regex.test(this.content)) return testingPrefix;
		}
		return null;
	}

	/**
	* Checks if the mention was used as a prefix
	* @since 0.5.0
	*/
	private _mentionPrefix(): CachedPrefix | null {
		const mentionPrefix = this.client.mentionPrefix.exec(this.content);
		return mentionPrefix ? { length: mentionPrefix[0].length, regex: this.client.mentionPrefix } : null;
	}

	/**
	* Checks if the natural prefix is used
	* @since 0.5.0
	*/
	private _naturalPrefix(): CachedPrefix | null {
		if (this.guildSettings.disableNaturalPrefix || !this.client.options.regexPrefix) return null;
		const results = this.client.options.regexPrefix.exec(this.content);
		return results ? { length: results[0].length, regex: this.client.options.regexPrefix } : null;
	}

	/**
	* Checks if a prefixless scenario is possible
	* @since 0.5.0
	*/
	private _prefixLess(): CachedPrefix | null {
		return this.client.options.noPrefixDM && this.channel.type === ChannelType.DM ? { length: 0, regex: null } : null;
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

extender.extend('Message', (__) => KlasaMessage);
