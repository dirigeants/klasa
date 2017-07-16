const now = require('performance-now');
const chalk = require('chalk');

const clk = new chalk.constructor({ enabled: true });

const { Finalizer } = require('../index');

module.exports = class extends Finalizer {

	constructor(...args) {
		super(...args, 'commandCooldown', {});
	}

	run(msg, mes, start) {
		if (this.client.config.cmdLogging) {
			clk.enabled = !this.client.config.disableLogColor;
			this.client.emit('log', [
				`${msg.cmd.help.name}(${msg.args.join(', ')})`,
				msg.reprompted ? `${clk.bgRed(`[${(now() - start).toFixed(2)}ms]`)}` : `${clk.bgBlue(`[${(now() - start).toFixed(2)}ms]`)}`,
				`${clk.black.bgYellow(`${msg.author.username}[${msg.author.id}]`)}`,
				this[msg.channel.type](msg)
			].join(' '), 'log');
		}
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
