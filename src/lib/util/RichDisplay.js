const { MessageEmbed: Embed } = require('discord.js');

const pagination = ['⏮', '◀', '▶', '⏭', '🔢'];
const infoEmoji = 'ℹ';
const stopEmoji = '⏹';

class RichDisplay {

	constructor(embed = new Embed()) {
		this.embedTemplate = embed;
		this.pages = [];
		this.infoPage = null;
	}

	get template() {
		return new Embed(this.embedTemplate);
	}

	addPage(embed) {
		this.pages.push(this._handlePageGeneration(embed));
		return this;
	}

	setInfoPage(embed) {
		this.infoPage = this._handlePageGeneration(embed);
		return this;
	}

	async run(msg, { startPage = 0, stop = true, filter = () => true, collectorOptions = {}, pageFooters = true, prompt = 'Which page would you like to jump to?' } = {}) {
		if (pageFooters) {
			for (let i = 1; i <= this.pages.length; i++) this.pages[i - 1].setFooter(`${i}/${this.pages.length}`);
			this.infoPage.setFooter('ℹ');
		}
		const emojis = pagination.slice(0);
		if (this.infoPage) emojis.push(infoEmoji);
		if (stop) emojis.push(stopEmoji);
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
			if (emoji === '⏮') {
				currentPage = 0;
				message.edit(this.pages[currentPage]);
			} else if (emoji === '◀' && currentPage > 0) {
				currentPage--;
				message.edit(this.pages[currentPage]);
			} else if (emoji === '▶' && currentPage < this.pages.length - 1) {
				currentPage++;
				message.edit(this.pages[currentPage]);
			} else if (emoji === '⏭') {
				currentPage = this.pages.length - 1;
				message.edit(this.pages[currentPage]);
			} else if (emoji === '🔢') {
				const mes = await message.channel.send(prompt);
				const collected = await message.channel.awaitMessages(mess => mess.author === user, { max: 1, time: 30000 });
				await mes.delete();
				if (!collected.size) return;
				const newPage = parseInt(collected.first().content);
				collected.first().delete();
				if (newPage && newPage > 0 && newPage <= this.pages.length) {
					currentPage = newPage - 1;
					message.edit(this.pages[currentPage]);
				}
			} else if (emoji === infoEmoji) {
				message.edit(this.infoPage);
			} else if (emoji === stopEmoji) {
				collector.stop();
			}
		});
		collector.on('end', () => {
			message.clearReactions();
		});
		return collector;
	}

	async _queueEmojiReactions(message, emojis) {
		const emoji = emojis.shift();
		await message.react(emoji);
		if (emojis.length) return this._queueEmojiReactions(message, emojis);
		return message;
	}

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

module.exports = RichDisplay;
