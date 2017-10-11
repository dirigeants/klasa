const now = require('performance-now');
const { MessageAttachment } = require('discord.js');
const { Command } = require('klasa');
const { inspect } = require('util');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['ev'],
			permLevel: 10,
			description: 'Evaluates arbitrary JavaScript. Reserved for bot owner.',
			usage: '<expression:str>'
		});

		// The depth to inspect the evaled output to, if it's not a string
		this.inspectionDepth = 0;
		// this.getTypeStr shouldn't recurse more than once, but just in case
		this.typeRecursionLimit = 2;
	}

	async run(msg, [code]) {
		try {
			const start = now();
			const evaledP = eval(code); // eslint-disable-line no-eval
			let evaled = evaledP instanceof Promise ? await evaledP : evaledP;
			const time = this.getNiceDuration(now() - start);

			const topLine = `${await this.getTypeStr(evaledP)}, ${time}`;
			if (typeof evaled !== 'string') evaled = inspect(evaled, { depth: this.inspectionDepth });

			// 1988 is 2000 - 12 (the chars that are added, "`...`\n```js\n...```")
			if (evaled.length > 1988 - topLine.length) {
				// Upload as a file attachment and send to channel
				return msg.channel.send(`\`${topLine}\``, new MessageAttachment(Buffer.from(`// ${topLine}\n${evaled}`), 'eval.js'));
			}

			return msg.send(`\`${topLine}\`\n${this.client.methods.util.codeBlock('js', this.client.methods.util.clean(evaled))}`);
		} catch (error) {
			if (error && error.stack) this.client.emit('error', error.stack);
			return msg.send(`\`ERROR\`\n${this.client.methods.util.codeBlock('js', this.client.methods.util.clean(error))}`);
		}
	}

	async getTypeStr(value, i = 0) {
		let typeStr = '';
		const basicType = typeof value;
		if (basicType === 'object') {
			if (value === null) {
				typeStr = 'null primitive';
			} else {
				let objType = value.constructor.name;
				if (value instanceof Promise) {
					if (objType !== 'Promise') objType += ' promise';
					typeStr = i <= this.typeRecursionLimit ?
						`awaited ${objType} object ➡ ${await this.getTypeStr(await value, i + 1)}` :
						`${objType} object`;
				} else if (value instanceof Boolean || value instanceof Number || value instanceof String) {
					typeStr = `${objType} object (not a primitive!)`;
				} else {
					if (objType === 'Object') objType = 'plain';
					typeStr = `${objType} object`;
				}
			}
		} else if (basicType === 'function') {
			const objType = value.constructor.name;
			typeStr = objType === 'Function' ?
				`${basicType} object` :
				`${objType} ${basicType} object`;
		} else {
			typeStr = `${basicType} primitive`;
		}

		return typeStr;
	}

	getNiceDuration(time) {
		if (time >= 1000) return `${(time / 1000).toFixed(2)}s`;
		if (time >= 1) return `${time.toFixed(2)}ms`;
		return `${(time * 1000).toFixed(2)}μs`;
	}

};
