const { Serializer } = require('klasa');
const URL = require('url');

module.exports = class extends Serializer {

	async deserialize(data, entry, language) {
		const url = URL.parse(data);
		if (url.protocol && url.hostname) return data;
		throw language.get('RESOLVER_INVALID_URL', entry.key);
	}

};
