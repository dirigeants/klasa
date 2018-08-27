const { Finalizer, Colors } = require('klasa');

module.exports = class extends Finalizer {

	constructor(...args) {
		super(...args);
		this.reprompted = [new Colors({ background: 'blue' }), new Colors({ background: 'red' })];
		this.user = new Colors({ background: 'yellow', text: 'black' });
		this.channel = {
			text: new Colors({ background: 'green', text: 'black' }),
			dm: new Colors({ background: 'magenta' }),
			group: new Colors({ background: 'cyan' })
		};
	}

	run(message, response, timer) {
		const { type } = message.channel;
		this.client.emit('log', [
			`${message.command.name}(${message.args.join(', ')})`,
			this.reprompted[Number(message.reprompted)].format(`[${timer.stop()}]`),
			this.user.format(`${message.author.username}[${message.author.id}]`),
			this.channel[type].format(this[type](message))
		].join(' '));
	}

	init() {
		this.enabled = this.client.options.commandLogging;
	}

	text(message) {
		return `${message.guild.name}[${message.guild.id}]`;
	}

	dm() {
		return 'Direct Messages';
	}

	group(message) {
		return `Group DM => ${message.channel.owner.username}[${message.channel.owner.id}]`;
	}

};
