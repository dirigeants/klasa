const { Event } = require('klasa');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, 'messageUpdate');
	}

	run(old, msg) {
		if (old.content !== msg.content && this.client.config.cmdEditing) this.client.emit('message', msg);
	}

};
