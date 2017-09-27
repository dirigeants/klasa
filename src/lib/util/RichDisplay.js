const { MessageEmbed: Embed } = require('discord.js');
const ReactionHandler = require('./ReactionHandler');

class RichDisplay {

	constructor(embed = new Embed()) {
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
	}

	get template() {
		return new Embed(this.embedTemplate);
	}

	setEmojis(emojis) {
		Object.assign(this.emojis, emojis);
		return this;
	}

	addPage(embed) {
		this.pages.push(this._handlePageGeneration(embed));
		return this;
	}

	setInfoPage(embed) {
		this.infoPage = this._handlePageGeneration(embed);
		return this;
	}

	async run(msg, options = {}) {
		if (!this.footered) this._footer();
		if (!options.filter) options.filter = () => true;
		const emojis = this._determineEmojis([], !('stop' in options) || ('stop' in options && options.stop));
		const message = msg.editable ? await msg.edit(this.pages[options.startPage || 0]) : await msg.channel.send(this.pages[options.startPage || 0]);
		return new ReactionHandler(
			message,
			(reaction, user) => emojis.includes(reaction.emoji.name) && user !== msg.client.user && options.filter(reaction, user),
			options,
			this,
			emojis
		);
	}

	async _footer() {
		for (let i = 1; i <= this.pages.length; i++) this.pages[i - 1].setFooter(`${i}/${this.pages.length}`);
		if (this.infoPage) this.infoPage.setFooter('ℹ');
	}

	_determineEmojis(emojis, stop) {
		if (this.pages.length > 1 || this.infoPage) emojis.push(this.emojis.first, this.emojis.back, this.emojis.forward, this.emojis.last, this.emojis.jump);
		if (this.infoPage) emojis.push(this.emojis.info);
		if (stop) emojis.push(this.emojis.stop);
		return emojis;
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
