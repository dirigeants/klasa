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
			let evaled = await eval(code);
			if (typeof evaled !== 'string') evaled = inspect(evaled, { depth: 0 });
			return msg.sendMessage(this.client.methods.util.clean(evaled), { code: 'js' });
		} catch (err) {
			if (err.stack) this.client.emit('error', err.stack);
			return msg.sendMessage(` \`ERROR\`\n${this.client.methods.util.codeBlock('js', this.client.methods.util.clean(err))}`);
		}
	}

};
