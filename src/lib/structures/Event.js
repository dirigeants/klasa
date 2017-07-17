class Event {

	constructor(client, dir, file, name) {
		this.client = client;
		this.dir = dir;
		this.file = file;
		this.name = name;
		this.type = 'event';
	}

	async reload() {
		const evt = this.client.events.load(this.dir, this.file);
		await evt.init();
		return evt;
	}

	unload() {
		return this.client.events.delete(this);
	}

	run() {
		// Defined in extension Classes
	}

	init() {
		// Optionally defined in extension Classes
	}

}

module.exports = Event;
