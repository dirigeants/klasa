const Type = require('./Type');

module.exports = class extends Type {

	async resolve(data, piece, message) {
		const string = String(data);
		return this.constructor.maxOrMin(this.client, string, message, piece) ? string : null;
	}

};
