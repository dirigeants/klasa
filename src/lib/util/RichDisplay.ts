import { Embed, EmojiResolvable, Message } from '@klasa/core';

import { ReactionHandler, ReactionHandlerFilter, ReactionHandlerOptions } from './ReactionHandler';

export interface RichDisplayEmojisObject {
	first: EmojiResolvable;
	back: EmojiResolvable;
	forward: EmojiResolvable;
	last: EmojiResolvable;
	jump: EmojiResolvable;
	info: EmojiResolvable;
	stop: EmojiResolvable;
}

export interface RichDisplayRunOptions extends Omit<ReactionHandlerOptions, 'filter'> {
	filter?: ReactionHandlerFilter;
	jump?: boolean;
	firstLast?: boolean;
}

export type EmbedResolvable = Embed | ((embed: Embed) => Embed);

export class RichDisplay {

	public embedTemplate: Embed;
	public pages: Embed[];
	public infoPage: Embed | null;
	public emojis: RichDisplayEmojisObject;
	public footered: boolean;
	public footerPrefix: string;
	public footerSuffix: string;

	public constructor(embed: Embed = new Embed()) {
		this.embedTemplate = embed;
		this.pages = [];
		this.infoPage = null;
		this.emojis = {
			first: '⏮',
			back: '◀',
			forward: '▶',
			last: '⏭',
			jump: '🔢',
			info: 'ℹ',
			stop: '⏹'
		};
		this.footered = false;
		this.footerPrefix = '';
		this.footerSuffix = '';
	}

	public get template(): Embed {
		return new Embed(this.embedTemplate);
	}

	public setEmojis(emojis: Partial<RichDisplayEmojisObject>): this {
		Object.assign(this.emojis, emojis);
		return this;
	}

	public setFooterPrefix(prefix: string): this {
		this.footered = false;
		this.footerPrefix = prefix;
		return this;
	}

	public setFooterSuffix(suffix: string): this {
		this.footered = false;
		this.footerSuffix = suffix;
		return this;
	}

	public useCustomFooters(): this {
		this.footered = true;
		return this;
	}

	public addPage(page: Embed | ((embed: Embed) => Embed)): this {
		this.pages.push(this._handlePageGeneration(page));
		return this;
	}

	public setInfoPage(embed: EmbedResolvable): this {
		this.infoPage = this._handlePageGeneration(embed);
		return this;
	}

	public async run(message: Message, options: RichDisplayRunOptions = {}): Promise<ReactionHandler> {
		if (!this.footered) this._footer();
		if (!options.filter) options.filter = (): boolean => true;
		const emojis = this._determineEmojis(
			[],
			!('stop' in options) || ('stop' in options && options.stop as boolean),
			!('jump' in options) || ('jump' in options && options.jump as boolean),
			!('firstLast' in options) || ('firstLast' in options && options.firstLast as boolean)
		);
		let msg: Message;
		if (message.editable) {
			await message.edit({ data: { embed: this.pages[options.startPage ?? 0] } });
			msg = message;
		} else {
			[msg] = await message.channel.send({ data: { embed: this.pages[options.startPage ?? 0] } });
		}

		const handler = new ReactionHandler(
			msg,
			(reaction, user): boolean => emojis.includes(reaction.emoji.id ?? reaction.emoji.name as string) && user !== message.client.user && (options.filter?.(reaction, user) ?? true),
			this,
			options,
			emojis
		);

		handler.run();

		return handler;
	}

	protected _determineEmojis(emojis: EmojiResolvable[], stop: boolean, jump: boolean, firstLast: boolean): EmojiResolvable[] {
		if (this.pages.length > 1 || this.infoPage) {
			if (firstLast) emojis.push(this.emojis.first, this.emojis.back, this.emojis.forward, this.emojis.last);
			else emojis.push(this.emojis.back, this.emojis.forward);
		}
		if (this.infoPage) emojis.push(this.emojis.info);
		if (stop) emojis.push(this.emojis.stop);
		if (jump) emojis.push(this.emojis.jump);
		return emojis;
	}

	private _footer(): void {
		for (let i = 1; i <= this.pages.length; i++) this.pages[i - 1].setFooter(`${this.footerPrefix}${i}/${this.pages.length}${this.footerSuffix}`);
		if (this.infoPage) this.infoPage.setFooter('ℹ');
	}

	private _handlePageGeneration(cb: EmbedResolvable): Embed {
		if (typeof cb === 'function') {
			// eslint-disable-next-line callback-return
			const page = cb(this.template);
			if (page instanceof Embed) return page;
		} else if (cb instanceof Embed) {
			return cb;
		}

		throw new Error('Expected an Embed or Function returning an Embed.');
	}

}
