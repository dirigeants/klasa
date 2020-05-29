import { Embed, Message } from '@klasa/core';
import { Cache } from '@klasa/cache';
import { ReactionMethods, ReactionHandlerOptions, ReactionHandler } from './ReactionHandler';

export interface RichDisplayOptions {
	template?: (embed: Embed) => Embed;
	infoPage?: (embed: Embed) => Embed;
	stop?: boolean;
	jump?: boolean;
	firstLast?: boolean;
}

export class RichDisplay {

	public pages: Embed[] = [];
	public infoPage: Embed | null = null;

	protected _emojis: Cache<ReactionMethods, string> = new Cache();
	protected _template: Embed;

	public constructor(options: RichDisplayOptions) {
		this._template = options.template?.(new Embed()) ?? new Embed();

		this._emojis
			.set(ReactionMethods.First, '⏮')
			.set(ReactionMethods.Back, '◀')
			.set(ReactionMethods.Forward, '▶')
			.set(ReactionMethods.Last, '⏭')
			.set(ReactionMethods.Jump, '🔢')
			.set(ReactionMethods.Info, 'ℹ')
			.set(ReactionMethods.Stop, '⏹');

		// To maintain emoji order, we will delete from rather than insert according to options

		if (!options.firstLast) {
			this._emojis.delete(ReactionMethods.First);
			this._emojis.delete(ReactionMethods.Last);
		}

		if (options.infoPage) this.infoPage = options.infoPage(this.template);
		else this._emojis.delete(ReactionMethods.Info);

		if (!options.jump) this._emojis.delete(ReactionMethods.Jump);
		if (!options.stop) this._emojis.delete(ReactionMethods.Stop);
	}

	public async run(message: Message, options: ReactionHandlerOptions): Promise<ReactionHandler> {
		return new ReactionHandler(message, options, this, this._emojis);
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
	 * A new instance of the template embed
	 * @since 0.4.0
	 */
	protected get template(): Embed {
		return new Embed(this._template);
	}

}
