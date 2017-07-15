const { Event } = require('../index');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, 'error');
	}

	run(err) {
		this.client.emit('log', err, 'error');
	}

};
