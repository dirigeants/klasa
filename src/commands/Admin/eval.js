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
		const headers = `${success ? '' : `\`${msg.language.get('COMMAND_EVAL_ERROR_HEADER')}\` | `}\`${type} ${time}\``;
		const silent = 'silent' in msg.flags;

		// Handle errors
		if (!success) {
			if (result && result.stack) this.client.emit('error', result.stack);
			if (!silent) return msg.sendMessage(`${headers}\n${this.client.methods.util.codeBlock('js', result)}`);
		}

		if (silent) return null;

		// Handle too-long-messages
		if (result.length > 1991 - headers.length) {
			if (msg.guild && msg.channel.attachable) {
				return msg.channel.sendFile(Buffer.from(result), 'eval.js', `${headers} | ${msg.language.get('COMMAND_EVAL_SENDFILE')}`);
			}
			this.client.emit('log', result);
			return msg.send(`${headers} | ${msg.language.get('COMMAND_EVAL_SENDCONSOLE')}`);
		}

		// If it's a message that can be sent correctly, send it
		return msg.send(`${headers}\n${this.client.methods.util.codeBlock('js', result)}`);
	}

	// Eval the input
	async eval(msg, code) {
		const stopwatch = new Stopwatch();
		let success, syncTime, asyncTime, result;
		let thenable = false;
		let type = '';
		try {
			if (msg.flags.async) code = `(async () => { ${code} })();`;
			result = eval(code);
			syncTime = stopwatch.friendlyDuration;
			if (this.client.methods.util.isThenable(result)) {
				thenable = true;
				type += this.client.methods.util.getTypeName(result);
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
