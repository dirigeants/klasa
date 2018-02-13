const { Event } = require('klasa');

module.exports = class extends Event {

	async run(old, msg) {
		if (!this.client.options.cmdEditing || old.content !== msg.content) return;
		const commandHandler = this.client.monitors.get('commandHandler');
		if (!commandHandler || !commandHandler.shouldRun(msg)) return;
		try {
			await commandHandler.run(msg);
		} catch (err) {
			this.client.emit('monitorError', msg, commandHandler, err);
		}
	}

};
