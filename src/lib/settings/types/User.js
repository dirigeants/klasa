const Type = require('./Type');

module.exports = class extends Type {

	async resolve(data, piece, message) {
		let user = this.client.users.resolve(data);
		if (user) return user.id;
		if (this.constructor.regex.userOrMember.test(data)) user = await this.client.users.fetch(this.constructor.regex.userOrMember.exec(data)[1]).catch(() => null);
		if (user) return user.id;
		throw (message ? message.languauge : this.client.languages.default).get('RESOLVER_INVALID', piece.key);
	}

};
