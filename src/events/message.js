const { Event } = require('../index');
const now = require('performance-now');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, 'message');
	}

	async run(msg) {
		if (!this.client.ready) return;
		await this.client.monitors.run(msg);
		if (!this.handleMessage(msg)) return;
		const res = await this.parseCommand(msg);
		if (!res.command) return;
		this.handleCommand(msg, res);
	}

	handleMessage(msg) {
		// Ignore Bots if True
		if (this.client.config.ignoreBots && msg.author.bot) return false;
		// Ignore Self if true
		if (this.client.config.ignoreSelf && msg.author.id === this.client.user.id) return false;
		// Ignore other users if selfbot
		if (!this.client.user.bot && msg.author.id !== this.client.user.id) return false;
		// Ignore self if bot
		if (this.client.user.bot && msg.author.id === this.client.user.id) return false;
		return true;
	}

	async parseCommand(msg, usage = false) {
		const prefix = await this.getPrefix(msg);
		if (!prefix) return false;
		const prefixLength = this.getLength(msg, prefix);
		if (usage) return prefixLength;
		return {
			command: msg.content.slice(prefixLength).split(' ')[0].toLowerCase(),
			prefix,
			prefixLength
		};
	}

	getLength(msg, prefix) {
		if (this.client.config.prefixMention === prefix) return prefix.exec(msg.content)[0].length + 1;
		return prefix.exec(msg.content)[0].length;
	}

	handleCommand(msg, { command, prefix, prefixLength }) {
		const validCommand = this.client.commands.get(command);
		if (!validCommand) return;
		const start = now();
		this.client.inhibitors.run(msg, validCommand)
			.then(() => {
				msg.cmdMsg = new this.client.methods.CommandMessage(msg, validCommand, prefix, prefixLength);
				this.runCommand(msg, start);
			})
			.catch((response) => msg.reply(response));
	}

	runCommand(msg, start) {
		msg.cmdMsg.validateArgs()
			.then((params) => {
				msg.cmdMsg.cmd.run(msg, params)
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

	async awaitMessage(msg, start, error) {
		const message = await msg.channel.send(`<@!${msg.member.id}> | **${error}** | You have **30** seconds to respond to this prompt with a valid argument. Type **"ABORT"** to abort this prompt.`)
			.catch((err) => { throw this.client.methods.util.newError(err); });

		const param = await msg.channel.awaitMessages(response => response.member.id === msg.author.id && response.id !== message.id, { max: 1, time: 30000, errors: ['time'] });
		if (param.first().content.toLowerCase() === 'abort') throw 'Aborted';
		msg.cmdMsg.args[msg.cmdMsg.args.lastIndexOf(null)] = param.first().content;
		msg.cmdMsg.reprompted = true;

		if (message.deletable) message.delete();

		return this.runCommand(msg, start);
	}

	handleError(msg, error) {
		if (error.stack) this.client.emit('error', error.stack);
		else if (error.message) msg.sendCode('JSON', error.message).catch(err => this.client.emit('error', err));
		else msg.sendMessage(error).catch(err => this.client.emit('error', err));
	}

	async getPrefix(client, msg) {
		if (client.config.prefixMention.test(msg.content)) return client.config.prefixMention;
		const { prefix } = msg.guildSettings;
		const { regExpEsc } = client.methods.util;
		if (prefix instanceof Array) {
			for (let i = prefix.length - 1; i >= 0; i--) if (msg.content.startsWith(prefix[i])) return new RegExp(`^${regExpEsc(prefix[i])}`);
		} else if (prefix && msg.content.startsWith(prefix)) { return new RegExp(`^${regExpEsc(prefix)}`); }
		return false;
	}

};

