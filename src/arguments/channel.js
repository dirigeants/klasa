const { Argument } = require('klasa');

module.exports = class extends Argument {

	run(arg, possible, message) {
		const channel = this.constructor.regex.channel.test(arg) ? this.client.channels.get(this.constructor.regex.channel.exec(arg)[1]) : null;
		if (channel) return channel;
		throw message.language.get('RESOLVER_INVALID_CHANNEL', possible.name);
	}

};
