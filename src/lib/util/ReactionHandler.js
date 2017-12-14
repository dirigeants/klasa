const { ReactionCollector } = require('discord.js');

/**
 * Klasa's ReactionHandler, for handling RichDisplay and RichMenu reaction input
 * @extends ReactionCollector
 */
class ReactionHandler extends ReactionCollector {


	/**
	 * A single unicode character
	 * @typedef {string} emoji
	 * @memberof ReactionHandler
	 */

	/**
	 * @typedef {object} ReactionHandlerOptions
	 * @property {Function} [filter] A filter function to add to the ReactionHandler
	 * @property {boolean} [stop=true] If a stop reaction should be included
	 * @property {string} [prompt=msg.language.get('REACTIONHANDLER_PROMPT')] The prompt to be used when awaiting user input on a page to jump to
	 * @property {number} [startPage=0] The page to start the RichMenu on
	 * @property {number} [max] The maximum total amount of reactions to collect
	 * @property {number} [maxEmojis] The maximum number of emojis to collect
	 * @property {number} [maxUsers] The maximum number of users to react
	 * @property {number} [time] The maximum amount of time before this RichMenu should expire
	 * @memberof RichMenu
	 */

	/**
	 * Constructs our ReactionHandler instance
	 * @since 0.4.0
	 * @param {KlasaMessage} msg A message this ReactionHandler should handle reactions
	 * @param {Function} filter A filter function to determine which emoji reactions should be handled
	 * @param {ReactionHandlerOptions} options The options for this ReactionHandler
	 * @param {(RichDisplay|RichMenu)} display The RichDisplay or RichMenu that this handler is for
	 * @param {emoji[]} emojis The emojis which should be used in this handler
	 */
	constructor(msg, filter, options, display, emojis) {
		super(msg, filter, options);

		/**
		 * The RichDisplay/RichMenu this Handler is for
		 * @since 0.4.0
		 * @type {(RichDisplay|RichMenu)}
		 */
		this.display = display;

		/**
		 * An emoji to method map, to map custom emojis to static method names
		 * @since 0.4.0
		 * @type {Map<string,emoji>}
		 */
		this.methodMap = new Map(Object.entries(this.display.emojis).map(([key, value]) => [value, key]));

		/**
		 * The current page the display is on
		 * @since 0.4.0
		 * @type {number}
		 */
		this.currentPage = this.options.startPage || 0;

		/**
		 * The prompt to use when jumping pages
		 * @since 0.4.0
		 * @type {string}
		 */
		this.prompt = this.options.prompt || msg.language.get('REACTIONHANDLER_PROMPT');

		/**
		 * The time until the reaction collector closes automatically
		 * @since 0.4.0
		 * @type {number}
		 */
		this.time = typeof this.options.time === 'number' ? this.options.time : 30000;

		/**
		 * Whether the menu is awaiting a response of a prompt, to block all other jump reactions
		 * @since 0.4.0
		 * @type {boolean}
		 */
		this.awaiting = false;

		/**
		 * The selection of a RichMenu (useless in a RichDisplay scenario)
		 * @since 0.4.0
		 * @type {Promise<number?>}
		 */
		this.selection = this.display.emojis.zero ? new Promise((resolve, reject) => {
			/**
			 * Causes this.selection to resolve
			 * @since 0.4.0
			 * @type {Function}
			 * @private
			 */
			this.reject = reject;

			/**
			 * Causes this.selection to reject
			 * @since 0.4.0
			 * @type {Function}
			 * @private
			 */
			this.resolve = resolve;
		}) : Promise.resolve(null);

		/**
		 * Whether reactions have finished queuing (used to handle clearing reactions on early menu selections)
		 * @since 0.4.0
		 * @type {boolean}
		 */
		this.reactionsDone = false;

		this._queueEmojiReactions(emojis.slice(0));
		this.on('collect', (reaction, reactionAgain, user) => {
			reaction.remove(user);
			this[this.methodMap.get(reaction.emoji.name)](user);
		});
		this.on('end', () => {
			if (this.reactionsDone) this.message.clearReactions();
		});
	}

	/**
	 * The action to take when the "first" emoji is reacted
	 * @since 0.4.0
	 * @returns {void}
	 */
	first() {
		this.currentPage = 0;
		this.update();
	}

	/**
	 * The action to take when the "back" emoji is reacted
	 * @since 0.4.0
	 * @returns {void}
	 */
	back() {
		if (this.currentPage <= 0) return;
		this.currentPage--;
		this.update();
	}

	/**
	 * The action to take when the "forward" emoji is reacted
	 * @since 0.4.0
	 * @returns {void}
	 */
	forward() {
		if (this.currentPage > this.display.pages.length - 1) return;
		this.currentPage++;
		this.update();
	}

	/**
	 * The action to take when the "last" emoji is reacted
	 * @since 0.4.0
	 * @returns {void}
	 */
	last() {
		this.currentPage = this.display.pages.length - 1;
		this.update();
	}

	/**
	 * The action to take when the "jump" emoji is reacted
	 * @since 0.4.0
	 * @param {KlasaUser} user The user to lock the awaitMessages to
	 * @returns {void}
	 */
	async jump(user) {
		if (this.awaiting) return;
		this.awaiting = true;
		const mes = await this.message.channel.send(this.prompt);
		const collected = await this.message.channel.awaitMessages(mess => mess.author === user, { max: 1, time: this.time });
		this.awaiting = false;
		await mes.delete();
		if (!collected.size) return;
		const newPage = parseInt(collected.first().content);
		collected.first().delete();
		if (newPage && newPage > 0 && newPage <= this.display.pages.length) {
			this.currentPage = newPage - 1;
			this.update();
		}
	}

	/**
	 * The action to take when the "info" emoji is reacted
	 * @since 0.4.0
	 * @returns {void}
	 */
	info() {
		this.message.edit(this.display.infoPage);
	}

	/**
	 * The action to take when the "stop" emoji is reacted
	 * @since 0.4.0
	 * @returns {void}
	 */
	stop() {
		if (this.resolve) this.resolve(null);
		super.stop();
	}

	/**
	 * The action to take when the "zero" emoji is reacted
	 * @since 0.4.0
	 * @returns {void}
	 */
	zero() {
		if (this.display.options.length - 1 < this.currentPage * 10) return;
		this.resolve(this.currentPage * 10);
		this.stop();
	}

	/**
	 * The action to take when the "one" emoji is reacted
	 * @since 0.4.0
	 * @returns {void}
	 */
	one() {
		if (this.display.options.length - 1 < 1 + (this.currentPage * 10)) return;
		this.resolve(1 + (this.currentPage * 10));
		this.stop();
	}

	/**
	 * The action to take when the "two" emoji is reacted
	 * @since 0.4.0
	 * @returns {void}
	 */
	two() {
		if (this.display.options.length - 1 < 2 + (this.currentPage * 10)) return;
		this.resolve(2 + (this.currentPage * 10));
		this.stop();
	}

	/**
	 * The action to take when the "three" emoji is reacted
	 * @since 0.4.0
	 * @returns {void}
	 */
	three() {
		if (this.display.options.length - 1 < 3 + (this.currentPage * 10)) return;
		this.resolve(3 + (this.currentPage * 10));
		this.stop();
	}

	/**
	 * The action to take when the "four" emoji is reacted
	 * @since 0.4.0
	 * @returns {void}
	 */
	four() {
		if (this.display.options.length - 1 < 4 + (this.currentPage * 10)) return;
		this.resolve(4 + (this.currentPage * 10));
		this.stop();
	}

	/**
	 * The action to take when the "five" emoji is reacted
	 * @since 0.4.0
	 * @returns {void}
	 */
	five() {
		if (this.display.options.length - 1 < 5 + (this.currentPage * 10)) return;
		this.resolve(5 + (this.currentPage * 10));
		this.stop();
	}

	/**
	 * The action to take when the "six" emoji is reacted
	 * @since 0.4.0
	 * @returns {void}
	 */
	six() {
		if (this.display.options.length - 1 < 6 + (this.currentPage * 10)) return;
		this.resolve(6 + (this.currentPage * 10));
		this.stop();
	}

	/**
	 * The action to take when the "seven" emoji is reacted
	 * @since 0.4.0
	 * @returns {void}
	 */
	seven() {
		if (this.display.options.length - 1 < 7 + (this.currentPage * 10)) return;
		this.resolve(7 + (this.currentPage * 10));
		this.stop();
	}

	/**
	 * The action to take when the "eight" emoji is reacted
	 * @since 0.4.0
	 * @returns {void}
	 */
	eight() {
		if (this.display.options.length - 1 < 8 + (this.currentPage * 10)) return;
		this.resolve(8 + (this.currentPage * 10));
		this.stop();
	}

	/**
	 * The action to take when the "nine" emoji is reacted
	 * @since 0.4.0
	 * @returns {void}
	 */
	nine() {
		if (this.display.options.length - 1 < 9 + (this.currentPage * 10)) return;
		this.resolve(9 + (this.currentPage * 10));
		this.stop();
	}

	/**
	 * Updates the display page
	 * @since 0.4.0
	 * @returns {void}
	 */
	update() {
		this.message.edit('', { embed: this.display.pages[this.currentPage] });
	}

	/**
	 * The action to take when the "first" emoji is reacted
	 * @since 0.4.0
	 * @param {emoji[]} emojis The remaining emojis to react
	 * @returns {null}
	 * @private
	 */
	async _queueEmojiReactions(emojis) {
		if (this.ended) return this.message.clearReactions();
		await this.message.react(emojis.shift());
		if (emojis.length) return this._queueEmojiReactions(emojis);
		this.reactionsDone = true;
		return null;
	}

}

module.exports = ReactionHandler;
