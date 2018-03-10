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

	run(msg, mes, timer) {
		const { type } = msg.channel;
		this.client.emit('log', [
			`${msg.command.name}(${msg.args.join(', ')})`,
			this.reprompted[Number(msg.reprompted)].format(`[${timer.stop()}]`),
			this.user.format(`${msg.author.username}[${msg.author.id}]`),
			this.channel[type].format(this[type](msg))
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
