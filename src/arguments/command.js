const { Argument } = require('klasa');

module.exports = class extends Argument {

	constructor(...args) {
		super(...args, { aliases: ['cmd'] });
	}

	run(arg, possible, msg) {
		const command = this.client.commands.get(arg.toLowerCase());
		if (command) return command;
		throw (msg.language || this.client.languages.default).get('RESOLVER_INVALID_PIECE', possible.name, 'command');
	}

};
