const { Finalizer } = require('klasa');
const now = require('performance-now');

module.exports = class extends Finalizer {

	constructor(...args) {
		super(...args);
		this.colors = {
			prompted: { message: { background: 'red' } },
			notprompted: { message: { background: 'blue' } },
			user: { message: { background: 'yellow', text: 'black' } },
			channel: {
				text: { message: { background: 'green', text: 'black' } },
				dm: { message: { background: 'magenta' } },
				group: { message: { background: 'cyan' } }
			}
		};
	}

	run(msg, mes, start) {
		this.client.emit('log', [
			`${msg.cmd.name}(${msg.args.join(', ')})`,
			msg.reprompted ?
				this.client.console.messages(`[${(now() - start).toFixed(2)}ms]`, this.colors.prompted.message) :
				this.client.console.messages(`[${(now() - start).toFixed(2)}ms]`, this.colors.notprompted.message),
			this.client.console.messages(`${msg.author.username}[${msg.author.id}]`, this.colors.user.message),
			this[msg.channel.type](msg)
		].join(' '), 'log');
	}

	init() {
		this.enabled = !!this.client.config.cmdLogging;
	}

	text(msg) {
		return this.client.console.messages(`${msg.guild.name}[${msg.guild.id}]`, this.colors.channel.text.message);
	}

	dm() {
		return this.client.console.messages('Direct Messages', this.colors.channel.dm.message);
	}

	group(msg) {
		return this.client.console.messages(`Group DM => ${msg.channel.owner.username}[${msg.channel.owner.id}]`, this.colors.channel.group.message);
	}

};
