const { Command, Stopwatch } = require('klasa');
const { inspect } = require('util');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['ev'],
			permLevel: 10,
			guarded: true,
			description: (msg) => msg.language.get('COMMAND_EVAL_DESCRIPTION'),
			extendedHelp: (msg) => msg.language.get('COMMAND_EVAL_EXTENDEDHELP'),
			usage: '<expression:str>'
		});
	}

	async run(msg, [code]) {
		const { success, result, time, type } = await this.eval(msg, code);
		const footer = this.client.methods.util.codeBlock('ts', type);
		const output = msg.language.get(success ? 'COMMAND_EVAL_OUTPUT' : 'COMMAND_EVAL_ERROR',
			time, this.client.methods.util.codeBlock('js', result), footer);

		// Handle errors
		if (!success) {
			if (result && result.stack) this.client.emit('error', result.stack);
			if (!msg.flags.silent) return msg.sendMessage(output);
		}

		if (msg.flags.silent) return null;

		// Handle too-long-messages
		if (output.length > 2000) {
			if (msg.guild && msg.channel.attachable) {
				return msg.channel.sendFile(Buffer.from(result), 'output.txt', msg.language.get('COMMAND_EVAL_SENDFILE', time, footer));
			}
			this.client.emit('log', result);
			return msg.sendMessage(msg.language.get('COMMAND_EVAL_SENDCONSOLE', time, footer));
		}

		// If it's a message that can be sent correctly, send it
		return msg.sendMessage(output);
	}

	// Eval the input
	async eval(msg, code) {
		if (msg.flags.async) code = `(async () => {\n${code}\n})();`;

		let success, syncTime, asyncTime, result;
		let thenable = false;
		let type = '';
		const stopwatch = new Stopwatch();

		try {
			result = eval(code);
			syncTime = `${stopwatch}`;

			if (this.client.methods.util.isThenable(result)) {
				thenable = true;
				type += this.client.methods.util.getTypeName(result);
				stopwatch.restart();
				result = await result;
				asyncTime = `${stopwatch}`;
			}

			success = true;
		} catch (error) {
			if (!syncTime) syncTime = `${stopwatch}`;
			if (thenable && !asyncTime) asyncTime = `${stopwatch}`;

			result = error;
			success = false;
		}

		type += thenable ? `<${this.client.methods.util.getDeepTypeName(result)}>` : this.client.methods.util.getDeepTypeName(result);

		if (success && typeof result !== 'string') {
			result = inspect(result, {
				depth: msg.flags.depth ? parseInt(msg.flags.depth) || 0 : 0,
				showHidden: Boolean(msg.flags.showHidden)
			});
		}

		return { success, type, time: this.formatTime(syncTime, asyncTime), result: this.client.methods.util.clean(result) };
	}

	formatTime(syncTime, asyncTime) {
		return asyncTime ? `⏱ ${asyncTime}<${syncTime}>` : `⏱ ${syncTime}`;
	}

};
