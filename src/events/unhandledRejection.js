const { Event } = require('klasa');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, { emitter: process });
		if (this.client.options.production) this.disable();
	}

	run(error) {
		if (!error) return;
		this.client.emit('error', `Uncaught Promise Error: \n${error.stack || error}`);
	}

};
