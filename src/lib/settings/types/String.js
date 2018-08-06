const Type = require('./Type');

module.exports = class extends Type {

	async resolve(data, piece, guild) {
		const string = String(data);
		return this.constructor.maxOrMin(this.client, string, guild, piece, 'RESOLVER_STRING_SUFFIX') ? string : null;
	}

};
