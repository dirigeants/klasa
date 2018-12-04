const { Serializer } = require('klasa');

module.exports = class extends Serializer {

	async deserialize(data, piece, language) {
		const string = String(data);
		return this.constructor.minOrMax(string.length, piece, language) && string;
	}

};
