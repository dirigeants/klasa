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
		this.paginated = false;
		this.options = [];
	}

	addPage() {
		throw new Error('You cannot directly add pages in a RichMenu');
	}

	addOption(name, body, inline = false) {
		this.options.push({ name, body, inline });
		return this;
	}

	async run(msg, options = {}) {
		if (!this.paginated) this._paginate();
		return super.run(msg, options);
	}

	_determineEmojis(emojis, stop) {
		emojis.push(this.emojis.zero, this.emojis.one, this.emojis.two, this.emojis.three, this.emojis.four, this.emojis.five, this.emojis.six, this.emojis.seven, this.emojis.eight, this.emojis.nine);
		return super._determineEmojis(emojis, stop);
	}

	_paginate(page = 0) {
		if (this.paginated) return null;
		super.addPage(embed => {
			for (let i = 0, option = this.options[i + (page * 10)]; i + (page * 10) < this.options.length && i < 10; i++, option = this.options[i + (page * 10)]) {
				embed.addField(`${i}. ${option.name}`, option.body, option.inline);
			}
			page++;
			return embed;
		});
		if (this.options.length > page * 10) return this._paginate(page);
		this.paginated = true;
		return null;
	}

}

module.exports = RichMenu;
