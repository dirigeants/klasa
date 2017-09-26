const { ReactionCollector } = require('discord.js');

class ReactionHandler extends ReactionCollector {

	constructor(msg, filter, options, display, emojis) {
		super(msg, filter, options);
		this.display = display;
		this.methodMap = new Map(Object.entries(emojis).map((key, value) => [value, key]));
		this.currentPage = this.options.startPage || 0;
		this.prompt = this.options.prompt || 'Which page would you like to jump to?';
		this.awaiting = false;
		this.selection = emojis.zero ? new Promise((resolve, reject) => {
			this.reject = reject;
			this.resolve = resolve;
		}) : Promise.resolve(null);
		this.on('collect', (reaction, reactionAgain, user) => {
			reaction.remove(user);
			this[this.methodMap.get(reaction.emoji.name)](reaction, user);
		});
		this.on('end', () => this.message.clearReactions());
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
		if (newPage && newPage > 0 && newPage <= this.pages.length) {
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
		this.resolve(0 + (this.currentPage * 10));
	}

	one() {
		this.resolve(1 + (this.currentPage * 10));
	}

	two() {
		this.resolve(2 + (this.currentPage * 10));
	}

	three() {
		this.resolve(3 + (this.currentPage * 10));
	}

	four() {
		this.resolve(4 + (this.currentPage * 10));
	}

	five() {
		this.resolve(5 + (this.currentPage * 10));
	}

	six() {
		this.resolve(6 + (this.currentPage * 10));
	}

	seven() {
		this.resolve(7 + (this.currentPage * 10));
	}

	eight() {
		this.resolve(8 + (this.currentPage * 10));
	}

	nine() {
		this.resolve(9 + (this.currentPage * 10));
	}

	update() {
		this.message.edit(this.display.pages[this.currentPage]);
	}

}

module.exports = ReactionHandler;
