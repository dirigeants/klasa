const { Argument } = require('klasa');

module.exports = class extends Argument {

	run(arg, possible, msg) {
		const channel = this.constructor.regex.channel.test(arg) ? this.client.channels.get(this.constructor.regex.channel.exec(arg)[1]) : null;
		if (channel) return channel;
		throw (msg.language || this.client.languages.default).get('RESOLVER_INVALID_CHANNEL', possible.name);
	}

};
