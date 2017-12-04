const { MessageAttachment } = require('discord.js');
const { Command, util, Stopwatch } = require('klasa');
const { inspect } = require('util');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['ev'],
			permLevel: 10,
			guarded: true,
			description: 'Evaluates arbitrary JavaScript. Reserved for bot owner.',
			usage: '<expression:str>',
			extendedHelp: `See the Klasa Pieces repo if you'd like an eval with more features.`
		});

		// The depth to inspect the evaled output to
		this.depth = 0;
		// How long to wait for promises to resolve
		this.wait = 10000;
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
		const stopwatchSync = new Stopwatch();
		const evaledOriginal = eval(code); // eslint-disable-line no-eval
		stopwatchSync.stop();

		const stopwatchAsync = new Stopwatch();
		const evaledTimeout = util.timeoutPromise(evaledOriginal, this.wait);
		// Awaiting a non-promise returns the non-promise
		let evaledValue = await evaledTimeout;
		stopwatchAsync.stop();

		const evaledIsThenable = util.isThenable(evaledOriginal);

		// We're doing this checking here so it's not counted in the stopwatch timing
		// And if the promise timed out, just show the promise
		if (!evaledIsThenable || evaledValue instanceof util.TimeoutError) evaledValue = evaledOriginal;

		const timeStr = evaledIsThenable ?
			`⏱${stopwatchSync}<${stopwatchAsync}>` :
			`⏱${stopwatchSync}`;

		const topLine = `${await util.getJSDocString(evaledOriginal, {
			depth: this.depth + 1,
			wait: this.wait,
			surrogatePromise: evaledIsThenable ? evaledTimeout : null
		})} ${timeStr}`;

		/** @todo Add more logic for string conversion / inspection, depending on type; see <#261102185759244289> */
		if (typeof evaledValue !== 'string') evaledValue = inspect(evaledValue, { depth: this.depth });

		return { evaled: evaledValue, topLine };
	}

	isTooLong(evaled, topLine) {
		// 1988 is 2000 - 12 (the chars that are added, "`...`\n```js\n...```")
		return evaled.length > 1988 - topLine.length;
	}

};
