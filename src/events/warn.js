const { Event } = require('../index');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, 'warn');
	}

	run(warning) {
		this.client.emit('log', warning, 'warn');
	}

};
