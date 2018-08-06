const Type = require('./Type');

module.exports = class extends Type {

	async resolve(data, piece, guild) {
		const number = this.checkNumber(data, piece, guild);
		if (isNaN(number)) throw (guild ? guild.languauge : this.client.languages.default).get('RESOLVER_INVALID_FLOAT', piece.key);
		return this.constructor.minOrMax(this.client, number, guild, piece) ? number : true;
	}

	checkNumber(data, piece, guild) {
		const type = piece.type.toLowerCase();
		let numb;
		switch (type) {
			case 'number': return Number(data);
			case 'integer':
				numb = parseInt(data);
				if (Number.isInteger(numb)) return numb;
				throw (guild ? guild.language : this.client.languages.default).get('RESOLVER_INVALID_INT', piece.key);
			case 'float': return parseFloat(data);
		}
		return null;
	}

};
