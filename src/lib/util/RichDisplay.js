const { MessageEmbed: Embed, Collection } = require('discord.js');

const pagination = ['⏮', '◀', '▶', '⏭', '🔢'];
const infoEmoji = 'ℹ';
const stopEmoji = '⏹';

class RichDisplay {

	constructor(embed = new Embed()) {
		this.embedTemplate = embed;
		this.pages = [];
		this.infoPage = null;
		this.collectors = new Collection();
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

	async run(msg, { startPage = 0, stop = true, filter = () => true, collectorOptions = {} } = {}) {
		const emojis = pagination.slice(0);
		if (this.infoPage) emojis.push(infoEmoji);
		if (stop) emojis.push(stopEmoji);
		let currentPage = startPage;
		let lastPage = 0;
		const message = await msg.channel.send(
			this.pages[currentPage].setFooter(`Page ${currentPage + 1} of ${this.pages.length}, last page: ${lastPage + 1}`)
		);
		await this._queueEmojiReactions(message, emojis.slice(0));
		const collector = message.createReactionCollector(
			(reaction, user) => emojis.includes(reaction.emoji.name) && user !== msg.client.user && filter(reaction, user),
			collectorOptions
		);
		this.collectors.set(message.id, collector);
		collector.on('collect', async (reaction, reactionAgain, user) => {
			const emoji = reaction.emoji.name;
			reaction.remove(user);
			if (emoji === '⏮') {
				lastPage = currentPage;
				currentPage = 0;
				message.edit(this.pages[currentPage].setFooter(`Page ${currentPage + 1} of ${this.pages.length}, last page: ${lastPage + 1}`));
			} else if (emoji === '◀' && currentPage > 0) {
				lastPage = currentPage;
				currentPage--;
				message.edit(this.pages[currentPage].setFooter(`Page ${currentPage + 1} of ${this.pages.length}, last page: ${lastPage + 1}`));
			} else if (emoji === '▶' && currentPage < this.pages.length - 1) {
				lastPage = currentPage;
				currentPage++;
				message.edit(this.pages[currentPage].setFooter(`Page ${currentPage + 1} of ${this.pages.length}, last page: ${lastPage + 1}`));
			} else if (emoji === '⏭') {
				lastPage = currentPage;
				currentPage = this.pages.length - 1;
				message.edit(this.pages[currentPage].setFooter(`Page ${currentPage + 1} of ${this.pages.length}, last page: ${lastPage + 1}`));
			} else if (emoji === '🔢') {
				const mes = await message.channel.send('Which page would you like to jump to?');
				const collected = await message.channel.awaitMessages(mess => mess.author === user, { max: 1 });
				await mes.delete();
				const newPage = parseInt(collected.first().content);
				collected.first().delete();
				if (newPage && newPage > 0 && newPage <= this.pages.length) {
					lastPage = currentPage;
					currentPage = newPage - 1;
					message.edit(this.pages[currentPage].setFooter(`Page ${currentPage + 1} of ${this.pages.length}, last page: ${lastPage + 1}`));
				}
			} else if (emoji === infoEmoji) {
				lastPage = currentPage;
				message.edit(this.infoPage.setFooter(`Information Page, last page: ${lastPage + 1}`));
			} else if (emoji === stopEmoji) {
				collector.stop();
			}
		});
		collector.on('end', () => {
			message.clearReactions();
			this.collectors.delete(message.id);
		});
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
