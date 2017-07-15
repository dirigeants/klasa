module.exports = class Event {

	constructor(client, dir, file, name) {
		this.client = client;
		this.dir = dir;
		this.file = file;
		this.name = name;
	}

	async reload() {
		const evt = this.client.events.load(this.dir, this.file);
		evt.init();
		return evt;
	}

	run() {
		// Defined in extension Classes
	}

	init() {
		// Optionally defined in extension Classes
	}

};
