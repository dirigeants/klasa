const { Command } = require('klasa');
const { inspect } = require('util');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['ev'],
			permLevel: 10,
			description: 'Evaluates arbitrary Javascript. Reserved for bot owner.',
			usage: '<expression:str>'
		});
	}

	async run(msg, [code]) {
		try {
			let evaled = eval(code);
			if (evaled instanceof Promise) evaled = await evaled;
			if (typeof evaled !== 'string') evaled = inspect(evaled, { depth: 0 });
			msg.sendCode('js', this.client.methods.util.clean(evaled));
		} catch (err) {
			msg.send(` \`ERROR\`\n${this.client.methods.util.codeBlock('js', this.client.methods.util.clean(err))}`);
			if (err.stack) this.client.emit('error', err.stack);
		}
	}

};
