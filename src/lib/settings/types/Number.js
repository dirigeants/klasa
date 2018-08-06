const Type = require('./Type');

module.exports = class extends Type {

	async resolve(data, piece, guild) {
		const number = this.checkNumber(data, piece);
		if (number === null || isNaN(number)) throw (guild ? guild.languauge : this.client.languages.default).get('RESOLVER_INVALID_CHANNEL', piece.key);
		return this.constructor.minOrMax(this.client, number, guild, piece) ? number : true;
	}

	checkNumber(data, piece) {
		const type = piece.type.toLowerCase();
		let numb;
		switch (type) {
			case 'number': return Number(data);
			case 'integer':
				numb = parseInt(data);
				return Number.isInteger(numb) ? numb : null;
			case 'float': return parseFloat(data);
		}
		return null;
	}

};
