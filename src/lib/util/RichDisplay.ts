import { Embed, EmojiResolvable } from '@klasa/core';

export interface RichDisplayEmojisObject {
	first: EmojiResolvable;
	back: EmojiResolvable;
	forward: EmojiResolvable;
	last: EmojiResolvable;
	jump: EmojiResolvable;
	info: EmojiResolvable;
	stop: EmojiResolvable;
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

	private _footer(): void {
		for (let i = 1; i <= this.pages.length; i++) this.pages[i - 1].setFooter(`${this.footerPrefix}${i}/${this.pages.length}${this.footerSuffix}`);
		if (this.infoPage) this.infoPage.setFooter('ℹ');
	}

	private _handlePageGeneration(cb:EmbedResolvable): Embed {
		if (typeof cb === 'function') {
			const page = cb(this.template);
			if (page instanceof Embed) return page;
		} else if (cb instanceof Embed) {
			return cb;
		}

		throw new Error('Expected an Embed or Function returning an Embed.');
	}

}
