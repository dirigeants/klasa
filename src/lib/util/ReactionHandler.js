const { ReactionCollector } = require('discord.js');

class ReactionHandler extends ReactionCollector {

	constructor(msg, filter, options, display, emojis) {
		super(msg, filter, options);
		this.display = display;
		this.methodMap = new Map(Object.entries(this.display.emojis).map(([key, value]) => [value, key]));
		this.currentPage = this.options.startPage || 0;
		this.prompt = this.options.prompt || 'Which page would you like to jump to?';
		this.awaiting = false;
		this.selection = this.display.emojis.zero ? new Promise((resolve, reject) => {
			this.reject = reject;
			this.resolve = resolve;
		}) : Promise.resolve(null);
		this._queueEmojiReactions(emojis.slice(0));
		this.on('collect', (reaction, reactionAgain, user) => {
			reaction.remove(user);
			this[this.methodMap.get(reaction.emoji.name)](reaction, user);
		});
		this.on('end', () => {
			// Attempt to solve ratelimit queue race condition
			setTimeout(() => this.message.clearReactions(), 100);
		});
	}

	first() {
		this.currentPage = 0;
		this.update();
	}

	back() {
		if (this.currentPage <= 0) return;
		this.currentPage--;
		this.update();
	}

	forward() {
		if (this.currentPage > this.display.pages.length - 1) return;
		this.currentPage++;
		this.update();
	}

	last() {
		this.currentPage = this.display.pages.length - 1;
		this.update();
	}

	async jump(reaction, user) {
		if (this.awaiting) return;
		this.awaiting = true;
		const mes = await this.message.channel.send(this.prompt);
		const collected = await this.message.channel.awaitMessages(mess => mess.author === user, { max: 1, time: 30000 });
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

	info() {
		this.message.edit(this.display.infoPage);
	}

	stop() {
		if (this.resolve) this.resolve(null);
		super.stop();
	}

	zero() {
		if (this.display.options.length - 1 < 0 + (this.currentPage * 10)) return;
		this.resolve(0 + (this.currentPage * 10));
		this.stop();
	}

	one() {
		if (this.display.options.length - 1 < 1 + (this.currentPage * 10)) return;
		this.resolve(1 + (this.currentPage * 10));
		this.stop();
	}

	two() {
		if (this.display.options.length - 1 < 2 + (this.currentPage * 10)) return;
		this.resolve(2 + (this.currentPage * 10));
		this.stop();
	}

	three() {
		if (this.display.options.length - 1 < 3 + (this.currentPage * 10)) return;
		this.resolve(3 + (this.currentPage * 10));
		this.stop();
	}

	four() {
		if (this.display.options.length - 1 < 4 + (this.currentPage * 10)) return;
		this.resolve(4 + (this.currentPage * 10));
		this.stop();
	}

	five() {
		if (this.display.options.length - 1 < 5 + (this.currentPage * 10)) return;
		this.resolve(5 + (this.currentPage * 10));
		this.stop();
	}

	six() {
		if (this.display.options.length - 1 < 6 + (this.currentPage * 10)) return;
		this.resolve(6 + (this.currentPage * 10));
		this.stop();
	}

	seven() {
		if (this.display.options.length - 1 < 7 + (this.currentPage * 10)) return;
		this.resolve(7 + (this.currentPage * 10));
		this.stop();
	}

	eight() {
		if (this.display.options.length - 1 < 8 + (this.currentPage * 10)) return;
		this.resolve(8 + (this.currentPage * 10));
		this.stop();
	}

	nine() {
		if (this.display.options.length - 1 < 9 + (this.currentPage * 10)) return;
		this.resolve(9 + (this.currentPage * 10));
		this.stop();
	}

	update() {
		this.message.edit(this.display.pages[this.currentPage]);
	}

	async _queueEmojiReactions(emojis) {
		if (this.ended) return null;
		await this.message.react(emojis.shift());
		if (emojis.length) return this._queueEmojiReactions(emojis);
		return null;
	}

}

module.exports = ReactionHandler;
