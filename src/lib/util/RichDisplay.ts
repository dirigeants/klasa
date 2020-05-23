import { Embed, EmojiResolvable } from '@klasa/core';
import { ReactionHandler } from './ReactionHandler';

/**
 * Klasa's RichDisplay, for helping paginated embeds with reaction buttons
 */
export class RichDisplay {

	/**
	 * The stored pages of the display.
	 * @since 0.4.0
	 */
	public pages: Embed[] = [];

	/**
	 * An optional info page.
	 * @since 0.4.0
	 */
	public infoPage: Embed | null = null;

	/**
	 * The default emojis to use for this display.
	 * @since 0.4.0
	 */
	public emojis: RichDisplayEmojisObject = {
		first: '⏮',
		back: '◀',
		forward: '▶',
		last: '⏭',
		jump: '🔢',
		info: 'ℹ',
		stop: '⏹'
	};

	/**
	 * If footers have been applied to all pages.
	 * @since 0.4.0
	 */
	public footered = false;

	/**
	 * Adds a prefix to all footers (before page/pages).
	 * @since 0.5.0
	 */
	public footerPrefix = '';

	/**
	 * Adds a suffix to all footers (after page/pages).
	 * @since 0.5.0
	 */
	public footerSuffix = '';

	/**
	 * The embed template.
	 * @since 0.4.0
	 */
	#template: Embed;

	/**
	 * Constructs our RichDisplay instance
	 * @since 0.4.0
	 * @param embed A Template embed to apply to all pages
	 */
	constructor(embed = new Embed()) {
		this.#template = embed;
	}

	/**
	 * A new instance of the template embed
	 * @since 0.4.0
	 */
	public get template(): Embed {
		return new Embed(this.#template);
	}

	/**
	 * Sets emojis to a new set of emojis
	 * @since 0.4.0
	 * @param emojis An object containing replacement emojis to use instead
	 * @chainable
	 */
	public setEmojis(emojis: Partial<RichDisplayEmojisObject>): this {
		Object.assign(this.emojis, emojis);
		return this;
	}

	/**
	 * Sets a prefix for all footers
	 * @since 0.5.0
	 * @param prefix The prefix you want to add
	 * @chainable
	 */
	public setFooterPrefix(prefix: string): this {
		this.footered = false;
		this.footerPrefix = prefix;
		return this;
	}

	/**
	 * Sets a suffix for all footers
	 * @since 0.5.0
	 * @param suffix The suffix you want to add
	 * @chainable
	 */
	public setFooterSuffix(suffix: string): this {
		this.footered = false;
		this.footerSuffix = suffix;
		return this;
	}

	/**
	 * Turns off the footer altering function
	 * @since 0.5.0
	 * @chainable
	 */
	public useCustomFooters(): this {
		this.footered = true;
		return this;
	}

	/**
	 * Adds a page to the RichDisplay
	 * @since 0.4.0
	 * @param embed A callback with the embed template passed and the embed returned, or an embed
	 * @chainable
	 */
	public addPage(embed: Embed | ((embed: Embed) => Embed)): this {
		this.pages.push(this._handlePageGeneration(embed));
		return this;
	}

	/**
	 * Adds an info page to the RichDisplay
	 * @since 0.4.0
	 * @param embed A callback with the embed template passed and the embed returned, or an embed
	 * @chainable
	 */
	setInfoPage(embed: Embed | ((embed: Embed) => Embed)): this {
		this.infoPage = this._handlePageGeneration(embed);
		return this;
	}

	/**
	 * Runs the RichDisplay
	 * @since 0.4.0
	 * @param {KlasaMessage} message A message to either edit, or use to send a new message for this RichDisplay
	 * @param {RichDisplayRunOptions} [options={}] The options to use while running this RichDisplay
	 * @returns {ReactionHandler}
	 */
	async run(message, options = {}) {
		if (!this.footered) this._footer();
		if (!options.filter) options.filter = () => true;
		const emojis = this._determineEmojis(
			[],
			!('stop' in options) || ('stop' in options && options.stop),
			!('jump' in options) || ('jump' in options && options.jump),
			!('firstLast' in options) || ('firstLast' in options && options.firstLast)
		);
		let msg;
		if (message.editable) {
			await message.edit({ embed: this.pages[options.startPage || 0] });
			msg = message;
		} else {
			msg = await message.channel.send(this.pages[options.startPage || 0]);
		}
		return new ReactionHandler(
			msg,
			(reaction, user) => emojis.includes(reaction.emoji.id || reaction.emoji.name) && user !== message.client.user && options.filter(reaction, user),
			options,
			this,
			emojis
		);
	}

	/**
	 * Adds page of pages footers to all pages
	 * @since 0.4.0
	 * @returns {void}
	 * @private
	 */
	async _footer() {
		for (let i = 1; i <= this.pages.length; i++) this.pages[i - 1].setFooter(`${this.footerPrefix}${i}/${this.pages.length}${this.footerSuffix}`);
		if (this.infoPage) this.infoPage.setFooter('ℹ');
	}

	/**
	 * Determines the emojis to use in this display
	 * @since 0.4.0
	 * @param {Emoji[]} emojis An array of emojis to use
	 * @param {boolean} stop Whether the stop emoji should be included
	 * @param {boolean} jump Whether the jump emoji should be included
	 * @param {boolean} firstLast Whether the first & last emojis should be included
	 * @returns {Emoji[]}
	 * @private
	 */
	_determineEmojis(emojis, stop, jump, firstLast) {
		if (this.pages.length > 1 || this.infoPage) {
			if (firstLast) emojis.push(this.emojis.first, this.emojis.back, this.emojis.forward, this.emojis.last);
			else emojis.push(this.emojis.back, this.emojis.forward);
		}
		if (this.infoPage) emojis.push(this.emojis.info);
		if (stop) emojis.push(this.emojis.stop);
		if (jump) emojis.push(this.emojis.jump);
		return emojis;
	}

	/**
	 * Resolves the callback or MessageEmbed into a MessageEmbed
	 * @since 0.4.0
	 * @param {(Function|external:MessageEmbed)} cb The callback or embed
	 * @returns {external:MessageEmbed}
	 * @private
	 */
	_handlePageGeneration(cb) {
		if (typeof cb === 'function') {
			// eslint-disable-next-line callback-return
			const page = cb(this.template);
			if (page instanceof Embed) return page;
		} else if (cb instanceof Embed) {
			return cb;
		}
		throw new Error('Expected a MessageEmbed or Function returning a MessageEmbed');
	}

}

export interface RichDisplayEmojisObject {
	/**
	 * The emoji for the 'first' button.
	 * @since 0.4.0
	 */
	first: EmojiResolvable;

	/**
	 * The emoji for the 'back' button.
	 * @since 0.4.0
	 */
	back: EmojiResolvable;

	/**
	 * The emoji for the 'forward' button.
	 * @since 0.4.0
	 */
	forward: EmojiResolvable;

	/**
	 * The emoji for the 'last' button.
	 * @since 0.4.0
	 */
	last: EmojiResolvable;

	/**
	 * The emoji for the 'jump' button.
	 * @since 0.4.0
	 */
	jump: EmojiResolvable;

	/**
	 * The emoji for the 'info' button.
	 * @since 0.4.0
	 */
	info: EmojiResolvable;

	/**
	 * The emoji for the 'stop' button.
	 * @since 0.4.0
	 */
	stop: EmojiResolvable;
}

/**
 * @typedef {Object} RichDisplayRunOptions
 * @property {Function} [filter] A filter function to add to the ReactionHandler (Receives: Reaction, User)
 * @property {boolean} [stop=true] If a stop reaction should be included
 * @property {boolean} [jump=true] If a jump reaction should be included
 * @property {boolean} [firstLast=true] If a first and last reaction should be included
 * @property {string} [prompt=message.language.get('REACTIONHANDLER_PROMPT')] The prompt to be used when awaiting user input on a page to jump to
 * @property {number} [startPage=0] The page to start the RichDisplay on
 * @property {number} [max] The maximum total amount of reactions to collect
 * @property {number} [maxEmojis] The maximum number of emojis to collect
 * @property {number} [maxUsers] The maximum number of users to react
 * @property {number} [time] The maximum amount of time in milliseconds before this RichDisplay should expire
 */
