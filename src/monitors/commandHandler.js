const { Monitor, CommandMessage, util: { regExpEsc, newError } } = require('klasa');
const now = require('performance-now');

module.exports = class extends Monitor {

	async run(msg) {
		// Ignore other users if selfbot
		if (!this.client.user.bot && msg.author.id !== this.client.user.id) return;
		const { command, prefix, prefixLength } = this.parseCommand(msg);
		if (!command) return;
		const validCommand = this.client.commands.get(command);
		if (!validCommand) return;
		const start = now();
		this.client.inhibitors.run(msg, validCommand)
			.then(() => this.runCommand(this.makeProxy(msg, new CommandMessage(msg, validCommand, prefix, prefixLength)), start))
			.catch((response) => msg.reply(response));
	}

	parseCommand(msg) {
		const prefix = this.getPrefix(msg);
		if (!prefix) return { command: false };
		const prefixLength = prefix.exec(msg.content)[0].length;
		return {
			command: msg.content.slice(prefixLength).trim().split(' ')[0].toLowerCase(),
			prefix,
			prefixLength
		};
	}

	getPrefix(msg) {
		if (this.client.config.prefixMention.test(msg.content)) return this.client.config.prefixMention;
		const { prefix } = msg.guildSettings;
		if (prefix instanceof Array) {
			for (let i = prefix.length - 1; i >= 0; i--) if (msg.content.startsWith(prefix[i])) return new RegExp(`^${regExpEsc(prefix[i])}`);
		} else if (prefix && msg.content.startsWith(prefix)) { return new RegExp(`^${regExpEsc(prefix)}`); }
		return false;
	}

	makeProxy(msg, cmdMsg) {
		return new Proxy(msg, {
			get: function handler(target, param) {
				return param in msg ? msg[param] : cmdMsg[param];
			}
		});
	}

	runCommand(msg, start) {
		msg.validateArgs()
			.then((params) => {
				msg.cmd.run(msg, params)
					.then(mes => this.client.finalizers.run(msg, mes, start))
					.catch(error => this.handleError(msg, error));
			})
			.catch((error) => {
				if (error.code === 1 && this.client.config.cmdPrompt) {
					return this.awaitMessage(this.client, msg, start, error.message)
						.catch(err => this.handleError(msg, err));
				}
				return this.handleError(msg, error);
			});
	}

	handleError(msg, error) {
		if (error.stack) this.client.emit('error', error.stack);
		else if (error.message) msg.sendCode('JSON', error.message).catch(err => this.client.emit('error', err));
		else msg.sendMessage(error).catch(err => this.client.emit('error', err));
	}

	async awaitMessage(msg, start, error) {
		const message = await msg.channel.send(`<@!${msg.author.id}> | **${error}** | You have **30** seconds to respond to this prompt with a valid argument. Type **"ABORT"** to abort this prompt.`)
			.catch((err) => { throw newError(err); });

		const param = await msg.channel.awaitMessages(response => response.author.id === msg.author.id && response.id !== message.id, { max: 1, time: 30000, errors: ['time'] });
		if (param.first().content.toLowerCase() === 'abort') throw 'Aborted';
		msg.args[msg.args.lastIndexOf(null)] = param.first().content;
		msg.reprompted = true;

		if (message.deletable) message.delete();

		return this.runCommand(msg, start);
	}

	init() {
		this.ignoreSelf = this.client.user.bot;
	}

};
