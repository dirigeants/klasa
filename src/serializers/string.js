const { Serializer } = require('klasa');

module.exports = class extends Serializer {

	async deserialize(data, entry, language) {
		const string = String(data);
		return this.constructor.minOrMax(string.length, entry, language) && string;
	}

};
