import { Embed, Message } from '@klasa/core';
import { Cache } from '@klasa/cache';
import { ReactionMethods, ReactionHandlerOptions, ReactionHandler } from './ReactionHandler';

type EmbedOrCallback = Embed | ((embed: Embed) => Embed);

export interface RichDisplayOptions {
	/**
	 * The template embed
	 * @default Embed
	 */
	template?: EmbedOrCallback;
	/**
	 * If the stop emoji should be included
	 * @default true
	 */
	stop?: boolean;
	/**
	 * If the jump emoji should be included
	 * @default true
	 */
	jump?: boolean;
	/**
	 * If the first and last emojis should be included
	 * @default true
	 */
	firstLast?: boolean;
}

/**
 * Klasa's RichDisplay, for helping paginated embeds with reaction buttons
 */
export class RichDisplay {

	/**
	 * The stored pages of the display
	 * @since 0.4.0
	 */
	public pages: Embed[] = [];

	/**
	 * An optional Info page/embed
	 * @since 0.4.0
	 */
	public infoPage: Embed | null = null;

	/**
	 * The emojis to use for this display
	 * @since 0.4.0
	 */
	protected _emojis: Cache<ReactionMethods, string> = new Cache();

	/**
	 * The embed template
	 * @since 0.4.0
	 */
	protected _template: Embed;

	/**
	 * If footers have been applied to all pages
	 * @since 0.4.0
	 */
	protected _footered = false;

	/**
	 * Adds a prefix to all footers (before page/pages)
	 * @since 0.5.0
	 */
	private footerPrefix = '';

	/**
	 * Adds a suffix to all footers (after page/pages)
	 * @since 0.5.0
	 */
	private footerSuffix = '';

	/**
	 * @param options The RichDisplay Options
	 */
	public constructor(options: RichDisplayOptions = {}) {
		this._template = this.resolveEmbedOrCallback(options.template ?? new Embed());

		this._emojis
			.set(ReactionMethods.First, '⏮')
			.set(ReactionMethods.Back, '◀')
			.set(ReactionMethods.Forward, '▶')
			.set(ReactionMethods.Last, '⏭')
			.set(ReactionMethods.Jump, '🔢')
			.set(ReactionMethods.Info, 'ℹ')
			.set(ReactionMethods.Stop, '⏹');

		// To maintain emoji order, we will delete from rather than insert according to options

		// eslint-disable-next-line @typescript-eslint/no-extra-parens
		if (!(options.firstLast ?? true)) {
			this._emojis.delete(ReactionMethods.First);
			this._emojis.delete(ReactionMethods.Last);
		}
		// eslint-disable-next-line @typescript-eslint/no-extra-parens
		if (!(options.jump ?? true)) this._emojis.delete(ReactionMethods.Jump);
		// eslint-disable-next-line @typescript-eslint/no-extra-parens
		if (!(options.stop ?? true)) this._emojis.delete(ReactionMethods.Stop);
	}

	/**
	 * Runs the RichDisplay
	 * @since 0.4.0
	 * @param message A message to either edit, or use to send a new message for this RichDisplay
	 * @param options The options to use while running this RichDisplay
	 */
	public async run(message: Message, options: ReactionHandlerOptions = {}): Promise<ReactionHandler> {
		if (!this.infoPage) this._emojis.delete(ReactionMethods.Info);
		if (!this._footered) this.footer();

		let msg;
		if (message.editable) {
			await message.edit(mb => mb.setEmbed(this.pages[options.startPage || 0]));
			msg = message;
		} else {
			[msg] = await message.channel.send(mb => mb.setEmbed(this.pages[options.startPage || 0]));
		}

		return new ReactionHandler(msg, options, this, this._emojis);
	}

	/**
	 * Sets emojis to a new set of emojis
	 * @since 0.4.0
	 * @param emojis An object containing replacement emojis to use instead
	 */
	public setEmojis(emojis: Record<ReactionMethods, string>): this {
		for (const [key, value] of Object.entries(emojis)) {
			if (this._emojis.has(key as ReactionMethods)) this._emojis.set(key as ReactionMethods, value);
		}
		return this;
	}

	/**
	 * Sets a prefix for all footers
	 * @since 0.5.0
	 * @param prefix The prefix you want to add
	 */
	public setFooterPrefix(prefix: string): this {
		this._footered = false;
		this.footerPrefix = prefix;
		return this;
	}

	/**
	 * Sets a suffix for all footers
	 * @since 0.5.0
	 * @param suffix The suffix you want to add
	 */
	public setFooterSuffix(suffix: string): this {
		this._footered = false;
		this.footerSuffix = suffix;
		return this;
	}

	/**
	 * Turns off the footer altering function
	 * @since 0.5.0
	 */
	public useCustomFooters(): this {
		this._footered = true;
		return this;
	}

	/**
	 * Adds a page to the RichDisplay
	 * @since 0.4.0
	 * @param embed A callback with the embed template passed and the embed returned, or an embed
	 */
	public addPage(embed: EmbedOrCallback): this {
		this.pages.push(this.resolveEmbedOrCallback(embed));
		return this;
	}

	/**
	 * Adds an info page to the RichDisplay
	 * @since 0.4.0
	 * @param embed A callback with the embed template passed and the embed returned, or an embed
	 */
	public setInfoPage(embed: EmbedOrCallback): this {
		this.infoPage = this.resolveEmbedOrCallback(embed);
		return this;
	}

	/**
	 * A new instance of the template embed
	 * @since 0.4.0
	 */
	protected get template(): Embed {
		return new Embed(this._template);
	}

	/**
	 * Adds page of pages footers to all pages
	 * @since 0.4.0
	 */
	private footer(): void {
		for (let i = 1; i <= this.pages.length; i++) this.pages[i - 1].setFooter(`${this.footerPrefix}${i}/${this.pages.length}${this.footerSuffix}`);
		if (this.infoPage) this.infoPage.setFooter('ℹ');
	}

	/**
	 * Resolves the callback or Embed into a Embed
	 * @since 0.4.0
	 * @param embed The callback or embed
	 */
	private resolveEmbedOrCallback(embed: EmbedOrCallback): Embed {
		if (typeof embed === 'function') {
			const page = embed(this.template);
			if (page instanceof Embed) return page;
		} else if (embed instanceof Embed) {
			return embed;
		}
		throw new TypeError('Expected a Embed or Function returning a Embed');
	}

}
