const { Event } = require('klasa');
const moment = require('moment');
const chalk = require('chalk');
const { inspect } = require('util');

module.exports = class extends Event {

	constructor(...args) {
		super(...args);

		const clk = new chalk.constructor({ enabled: !this.client.config.disableLogColor });

		this.formats = {
			verbose: { time: clk.grey, msg: clk.grey, logger: 'log' },
			debug: { time: clk.magenta, logger: 'log' },
			log: { time: clk.blue },
			warn: { time: clk.black.bgYellow },
			error: { time: clk.bgRed },
			wtf: { time: clk.bold.underline.bgRed, msg: clk.bold.underline.bgRed, logger: 'error' }
		};
	}

	run(data, type = 'log') {
		type = type.toLowerCase();

		data = data.stack || data.message || data;
		if (typeof data === 'object' && typeof data !== 'string' && !Array.isArray(data)) data = inspect(data, { depth: 0, colors: true });
		if (Array.isArray(data)) data = data.join('\n');

		const format = this.formats[type || 'log'];
		let timestamp = this.client.config.disableLogTimestamps ? '' : `[${moment().format('YYYY-MM-DD HH:mm:ss')}]`;
		if ('time' in format) timestamp = format.time(timestamp);
		// eslint-disable-next-line no-console
		console[format.logger || 'log'](data.split('\n').map(str => `${timestamp}${format.msg ? format.msg(timestamp ? ` ${str}` : str) : timestamp ? ` ${str}` : str}`).join('\n'));
	}

};
