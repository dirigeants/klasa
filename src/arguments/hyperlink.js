const { parse } = require('url');
const { Argument } = require('klasa');

module.exports = class extends Argument {

	constructor(...args) {
		super(...args, { aliases: ['url'] });
	}

	run(arg, possible, msg) {
		const res = parse(arg);
		const hyperlink = res.protocol && res.hostname ? hyperlink : null;
		if (hyperlink !== null) return hyperlink;
		throw (msg.language || this.client.languages.default).get('RESOLVER_INVALID_URL', possible.name);
	}

};
