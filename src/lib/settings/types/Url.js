const Type = require('./Type');
const URL = require('url');

module.exports = class extends Type {

	async resolve(data, piece, guild) {
		const url = URL.parse(data);
		if (url.protocol && url.hostname) return data;
		throw (guild ? guild.language : this.client.languages.default).get('RESOLVER_INVALID_URL', piece.key);
	}

};
