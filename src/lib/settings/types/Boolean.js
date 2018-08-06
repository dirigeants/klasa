const Type = require('./Type');

module.exports = class extends Type {

	async resolve(data, piece, guild) {
		if (typeof data === 'boolean') return data;
		let bool = String(data).toLowerCase();
		if (['1', 'true', '+', 't', 'yes', 'y'].includes(bool)) bool = true;
		if (['0', 'false', '-', 'f', 'no', 'n'].includes(bool)) bool = false;
		if (typeof bool === 'boolean') return bool;
		throw (guild ? guild.languauge : this.client.languages.default).get('RESOLVER_INVALID_BOOL', piece.key);
	}

};
