const { Serializer } = require('klasa');

module.exports = class extends Serializer {

	serialize(data) {
		return data;
	}

};
