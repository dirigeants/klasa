const { Event } = require('klasa');

const HEADER = `\x1b[31m[RATELIMIT]\x1b[0m`;

module.exports = class extends Event {

	run({ timeout, limit, method, path, route }) {
		this.client.emit('wtf',
			`${HEADER} \nTimeout: ${timeout}ms\nLimit: ${limit} requests\nMethod: ${method.toUpperCase()}\nPath ${path}\nRoute: ${route}`);
	}

};
