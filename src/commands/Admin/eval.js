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
		const headers = `${success ? '' : '`ERROR` | '}\`${type} ${time}\``;

		// Handle errors
		if (!success) {
			if (result && result.stack) this.client.emit('error', result.stack);
			return msg.sendMessage(`${headers}\n${this.client.methods.util.codeBlock('js', result)}`);
		}

		if (msg.flags.silent) return null;

		// Handle too-long-messages
		if (this.isTooLong(result, headers)) {
			if (msg.guild && msg.channel.permissionsFor(msg.guild.me).has('ATTACH_FILES')) {
				return msg.channel.sendFile(Buffer.from(result), 'eval.js', `${headers} | Output was too long... sent the result as a file.`);
			}
			this.client.emit('log', result);
			return msg.send(`${headers} | Output was too long... sent the result to console.`);
		}

		// If it's a message that can be sent correctly, send it
		return msg.send(`${headers}\n${this.client.methods.util.codeBlock('js', result)}`);
	}

	// Eval the input
	async eval(msg, code) {
		const stopwatch = new Stopwatch();
		let success;
		let thenable = false;
		let syncTime;
		let asyncTime;
		let result;
		try {
			if (msg.flags.async) code = `(async () => { ${code} })();`;
			result = eval(code);
			syncTime = stopwatch.friendlyDuration;
			if (this.client.methods.util.isPromise(result)) {
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
		const type = this.getType(result, thenable);
		if (success && typeof result !== 'string') {
			result = inspect(result, { depth: msg.flags.depth ? parseInt(msg.flags.depth) || 0 : 0 });
		}
		return { success, type, time: this.formatTime(syncTime, asyncTime), result: this.client.methods.util.clean(result) };
	}

	getType(output, thenable) {
		if (thenable) return `Promise<${this.getTypePrimitive(output)}>`;
		return this.getTypePrimitive(output);
	}

	getTypePrimitive(output) {
		if (typeof output === 'undefined') return 'void';
		if (typeof output !== 'object') return typeof output;
		if (output === null) return 'null';
		if (output.constructor && output.constructor.name) return output.constructor.name;
		return 'any';
	}

	formatTime(syncTime, asyncTime) {
		if (asyncTime) return `⏱ ${asyncTime}<${syncTime}>`;
		return `⏱ ${syncTime}`;
	}

	isTooLong(evaled, headers) {
		return evaled.length > 1991 - headers.length;
	}

};
