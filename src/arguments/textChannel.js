const { Argument } = require('klasa');

module.exports = class extends Argument {

	async run(arg, possible, message) {
		const channel = await this.store.get('channel').run(arg, possible, message);
		if (channel && channel.type === 'text') return channel;
		throw message.language.get('RESOLVER_INVALID_CHANNEL', possible.name);
	}

};
