const now = require('performance-now');
const { MessageAttachment } = require('discord.js');
const { Command, util } = require('klasa');
const { inspect } = require('util');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['ev'],
			permLevel: 10,
			description: 'Evaluates arbitrary JavaScript. Reserved for bot owner.',
			usage: '<expression:str>',
			extendedHelp: `See the Klasa Pieces repo if you'd like an eval with more features.`
		});

		// The depth to inspect the evaled output to, if it's not a string
		this.inspectionDepth = 0;
		// How long to wait for promises to resolve
		this.wait = 10000;
		// The depth to get the types of nested data structures, recursively
		this.typeDepth = 2;
	}

	async run(msg, [code]) {
		try {
			const { evaled, topLine } = await this.eval(code, msg);

			if (this.isTooLong(evaled, topLine)) {
				// Upload as a file attachment and send to channel
				return msg.channel.send(`\`${topLine}\``, new MessageAttachment(Buffer.from(`// ${topLine}\n${evaled}`), 'eval.js'));
			}

			return msg.send(`\`${topLine}\`\n${this.client.methods.util.codeBlock('js', this.client.methods.util.clean(evaled))}`);
		} catch (error) {
			if (error && error.stack) this.client.emit('error', error.stack);
			return msg.send(`\`ERROR\`\n${this.client.methods.util.codeBlock('js', this.client.methods.util.clean(error))}`);
		}
	}

	async eval(code, msg) { // eslint-disable-line no-unused-vars
		const start = now();
		const evaledOriginal = eval(code); // eslint-disable-line no-eval
		const syncEnd = now();
		const evaledTimeout = util.timeoutPromise(evaledOriginal, this.wait);
		// Awaiting a non-promise returns the non-promise
		let evaledValue = await evaledTimeout;
		const asyncEnd = now();

		const evaledIsThenable = util.isThenable(evaledOriginal);

		// We're doing this checking here so it's not counted in the performance-now timeing
		// And if the promise timed out, just show the promise
		if (!evaledIsThenable || evaledValue instanceof util.TimeoutError) evaledValue = evaledOriginal;

		const time = evaledIsThenable ?
			`⏱${util.getNiceDuration(syncEnd - start)}<${util.getNiceDuration(asyncEnd - syncEnd)}>` :
			`⏱${util.getNiceDuration(syncEnd - start)}`;

		const topLine = `${await this.getTypeStr(
			evaledOriginal,
			evaledIsThenable ? evaledTimeout : null
		)} ${time}`;

		if (typeof evaledValue !== 'string') evaledValue = inspect(evaledValue, { depth: this.inspectionDepth });

		return { evaled: evaledValue, topLine };
	}

	isTooLong(evaled, topLine) {
		// 1988 is 2000 - 12 (the chars that are added, "`...`\n```js\n...```")
		return evaled.length > 1988 - topLine.length;
	}

	async getTypeStr(value, awaitedPromise = null) {
		return util.getJSDocString(value, {
			depth: this.typeDepth,
			wait: this.wait,
			surrogatePromise: awaitedPromise
		});
	}

};
