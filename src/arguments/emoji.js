const { Argument } = require('klasa');

module.exports = class extends Argument {

	run(arg, possible, msg) {
		const emoji = this.constructor.regex.emoji.test(arg) ? this.client.emojis.get(this.constructor.regex.emoji.exec(arg)[1]) : null;
		if (emoji) return emoji;
		throw (msg.language || this.client.languages.default).get('RESOLVER_INVALID_EMOJI', possible.name);
	}

};
