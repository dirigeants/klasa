const RichDisplay = require('./RichDisplay');

class RichMenu extends RichDisplay {

	constructor(embed) {
		super(embed);
		Object.assign(this.emojis, {
			zero: '0⃣',
			one: '1⃣',
			two: '2⃣',
			three: '3⃣',
			four: '4⃣',
			five: '5⃣',
			six: '6⃣',
			seven: '7⃣',
			eight: '8⃣',
			nine: '9⃣'
		});
		this.pageinated = false;
		this.options = [];
	}

	addPage() {
		throw new Error('You cannot directly add pages in a RichMenu');
	}

	addOption(name, body, inline = false) {
		this.options.push({ name, body, inline });
		return this;
	}

	run(msg, { startPage = 0, stop = true, filter = () => true, collectorOptions = {}, pageFooters = true, prompt = 'Which page would you like to jump to?' } = {}) {
		return new Promise(async resolve => {
			if (!this.pageinated) this._paginate();
			if (pageFooters) {
				for (let i = 1; i <= this.pages.length; i++) this.pages[i - 1].setFooter(`${i}/${this.pages.length}`);
				if (this.infoPage) this.infoPage.setFooter('ℹ');
			}
			let awaiting = false;
			const emojis = [
				this.emojis.first,
				this.emojis.prev,
				this.emojis.next,
				this.emojis.last,
				this.emojis.jump,
				this.emojis.zero,
				this.emojis.one,
				this.emojis.two,
				this.emojis.three,
				this.emojis.four,
				this.emojis.five,
				this.emojis.six,
				this.emojis.seven,
				this.emojis.eight,
				this.emojis.nine
			];
			if (this.infoPage) emojis.push(this.emojis.info);
			if (stop) emojis.push(this.emojis.stop);
			let currentPage = startPage;
			const message = await msg.channel.send(this.pages[currentPage]);
			this._queueEmojiReactions(message, emojis.slice(0));
			const collector = message.createReactionCollector(
				(reaction, user) => emojis.includes(reaction.emoji.name) && user !== msg.client.user && filter(reaction, user),
				collectorOptions
			);
			collector.on('collect', async (reaction, reactionAgain, user) => {
				const emoji = reaction.emoji.name;
				reaction.remove(user);
				if (emoji === this.emojis.first) {
					currentPage = 0;
					message.edit(this.pages[currentPage]);
				} else if (emoji === this.emojis.prev && currentPage > 0) {
					currentPage--;
					message.edit(this.pages[currentPage]);
				} else if (emoji === this.emojis.next && currentPage < this.pages.length - 1) {
					currentPage++;
					message.edit(this.pages[currentPage]);
				} else if (emoji === this.emojis.last) {
					currentPage = this.pages.length - 1;
					message.edit(this.pages[currentPage]);
				} else if (emoji === this.emojis.jump) {
					if (awaiting) return;
					awaiting = true;
					const mes = await message.channel.send(prompt);
					const collected = await message.channel.awaitMessages(mess => mess.author === user, { max: 1, time: 30000 });
					awaiting = false;
					await mes.delete();
					if (!collected.size) return;
					const newPage = parseInt(collected.first().content);
					collected.first().delete();
					if (newPage && newPage > 0 && newPage <= this.pages.length) {
						currentPage = newPage - 1;
						message.edit(this.pages[currentPage]);
					}
				} else if (emoji === this.emojis.info) {
					message.edit(this.infoPage);
				} else if (emoji === this.emojis.stop) {
					resolve({ option: null, message });
					collector.stop();
				} else if (emoji === this.emojis.zero && this.options[0 + (currentPage * 10)]) {
					resolve({ option: 0 + (currentPage * 10), message });
					collector.stop();
				} else if (emoji === this.emojis.one && this.options[1 + (currentPage * 10)]) {
					resolve({ option: 1 + (currentPage * 10), message });
					collector.stop();
				} else if (emoji === this.emojis.two && this.options[2 + (currentPage * 10)]) {
					resolve({ option: 2 + (currentPage * 10), message });
					collector.stop();
				} else if (emoji === this.emojis.three && this.options[3 + (currentPage * 10)]) {
					resolve({ option: 3 + (currentPage * 10), message });
					collector.stop();
				} else if (emoji === this.emojis.four && this.options[4 + (currentPage * 10)]) {
					resolve({ option: 4 + (currentPage * 10), message });
					collector.stop();
				} else if (emoji === this.emojis.five && this.options[5 + (currentPage * 10)]) {
					resolve({ option: 5 + (currentPage * 10), message });
					collector.stop();
				} else if (emoji === this.emojis.six && this.options[6 + (currentPage * 10)]) {
					resolve({ option: 6 + (currentPage * 10), message });
					collector.stop();
				} else if (emoji === this.emojis.seven && this.options[7 + (currentPage * 10)]) {
					resolve({ option: 7 + (currentPage * 10), message });
					collector.stop();
				} else if (emoji === this.emojis.eight && this.options[8 + (currentPage * 10)]) {
					resolve({ option: 8 + (currentPage * 10), message });
					collector.stop();
				} else if (emoji === this.emojis.nine && this.options[9 + (currentPage * 10)]) {
					resolve({ option: 9 + (currentPage * 10), message });
					collector.stop();
				}
			});
			collector.on('end', () => message.clearReactions());
		});
	}

	_pageinate(page = 0) {
		if (this.pageinated) return null;
		this.pageinated = true;
		super.addPage(embed => {
			for (let i = 0, option = this.options[i + (page * 10)]; i + (page * 10) < this.options.length && i < 10; i++, option = this.options[i + (page * 10)]) {
				embed.addField(`${i}. ${option.name}`, option.body, option.inline);
			}
			page++;
			return embed;
		});
		if (this.options.length > page * 10) return this._pageinate(page);
		return null;
	}

}

module.exports = RichMenu;
