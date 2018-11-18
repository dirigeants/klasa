const { Serializer } = require('klasa');

module.exports = class extends Serializer {

	async deserialize(data) {
		return data;
	}

};
