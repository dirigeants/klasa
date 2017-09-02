const { Finalizer } = require('klasa');
const now = require('performance-now');
const chalk = require('chalk');

const clk = new chalk.constructor({ enabled: true });

module.exports = class extends Finalizer {

	run(msg, mes, start) {
		if (this.client.config.cmdLogging !== true) return;
		this.client.emit('log', [
			`${msg.cmd.name}(${msg.args.join(', ')})`,
			msg.reprompted ? `${clk.bgRed(`[${(now() - start).toFixed(2)}ms]`)}` : `${clk.bgBlue(`[${(now() - start).toFixed(2)}ms]`)}`,
			`${clk.black.bgYellow(`${msg.author.username}[${msg.author.id}]`)}`,
			this[msg.channel.type](msg)
		].join(' '), 'log');
	}

	init() {
		clk.enabled = !this.client.config.disableLogColor;
	}

	text(msg) {
		return `${clk.bgGreen(`${msg.guild.name}[${msg.guild.id}]`)}`;
	}

	dm() {
		return `${clk.bgMagenta('Direct Messages')}`;
	}

	group(msg) {
		return `${clk.bgCyan(`Group DM => ${msg.channel.owner.username}[${msg.channel.owner.id}]`)}`;
	}

};
