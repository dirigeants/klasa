const { Command, Stopwatch, Type } = require('klasa');
const { inspect } = require('util');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['ev'],
			permLevel: 10,
			guarded: true,
			description: (message) => message.language.get('COMMAND_EVAL_DESCRIPTION'),
			extendedHelp: (message) => message.language.get('COMMAND_EVAL_EXTENDEDHELP'),
			usage: '<expression:str>'
		});
	}

	async run(message, [code]) {
		const { success, result, time, type } = await this.eval(message, code);
		const footer = this.client.methods.util.codeBlock('ts', type);
		const output = message.language.get(success ? 'COMMAND_EVAL_OUTPUT' : 'COMMAND_EVAL_ERROR',
			time, this.client.methods.util.codeBlock('js', result), footer);
		const silent = 'silent' in message.flags;

		// Handle errors
		if (!success) {
			if (result && result.stack) this.client.emit('error', result.stack);
			if (!silent) return message.sendMessage(output);
		}

		if (silent) return null;

		// Handle too-long-messages
		if (output.length > 2000) {
			if (message.guild && message.channel.attachable) {
				return message.channel.sendFile(Buffer.from(result), 'output.txt', message.language.get('COMMAND_EVAL_SENDFILE', time, footer));
			}
			this.client.emit('log', result);
			return message.sendMessage(message.language.get('COMMAND_EVAL_SENDCONSOLE', time, footer));
		}

		// If it's a message that can be sent correctly, send it
		return message.sendMessage(output);
	}

	// Eval the input
	async eval(message, code) {
		const stopwatch = new Stopwatch();
		let success, syncTime, asyncTime, result;
		let thenable = false;
		let type;
		try {
			if (message.flags.async) code = `(async () => {\n${code}\n})();`;
			result = eval(code);
			syncTime = stopwatch.friendlyDuration;
			type = new Type(result);
			if (this.client.methods.util.isThenable(result)) {
				thenable = true;
				stopwatch.restart();
				result = await result;
				asyncTime = stopwatch.friendlyDuration;
			}
			success = true;
		} catch (error) {
			if (!syncTime) syncTime = stopwatch.friendlyDuration;
			if (thenable && !asyncTime) asyncTime = stopwatch.friendlyDuration;
			result = error;
			success = false;
		}

		stopwatch.stop();
		if (success && typeof result !== 'string') {
			result = inspect(result, {
				depth: message.flags.depth ? parseInt(message.flags.depth) || 0 : 0,
				showHidden: Boolean(message.flags.showHidden)
			});
		}
		return { success, type, time: this.formatTime(syncTime, asyncTime), result: this.client.methods.util.clean(result) };
	}

	formatTime(syncTime, asyncTime) {
		return asyncTime ? `⏱ ${asyncTime}<${syncTime}>` : `⏱ ${syncTime}`;
	}

};
