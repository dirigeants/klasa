const { Finalizer, Colors } = require('klasa');

module.exports = class extends Finalizer {

	constructor(...args) {
		super(...args);
		this.colors = {
			prompted: new Colors({ background: 'red' }),
			notPrompted: new Colors({ background: 'blue' }),
			user: new Colors({ background: 'yellow', text: 'black' }),
			channel: {
				text: new Colors({ background: 'green', text: 'black' }),
				dm: new Colors({ background: 'magenta' }),
				group: new Colors({ background: 'cyan' })
			}
		};
	}

	run(msg, mes, timer) {
		const { useColors } = this.client.console;
		const { type } = msg.channel;
		this.client.emit('log', [
			`${msg.command.name}(${msg.args.join(', ')})`,
			this.colors[msg.reprompted ? 'prompted' : 'notPrompted'].format(`[${timer.stop()}]`, useColors),
			this.colors.user.format(`${msg.author.username}[${msg.author.id}]`, useColors),
			this.colors.channel[type].format(this[type](msg), useColors)
		].join(' '));
	}

	init() {
		this.enabled = this.client.options.cmdLogging;
	}

	text(msg) {
		return `${msg.guild.name}[${msg.guild.id}]`;
	}

	dm() {
		return 'Direct Messages';
	}

	group(msg) {
		return `Group DM => ${msg.channel.owner.username}[${msg.channel.owner.id}]`;
	}

};
