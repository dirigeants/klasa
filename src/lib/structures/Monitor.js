module.exports = class Monitor {

	constructor(client, dir, file, name) {
		this.client = client;
		this.dir = dir;
		this.file = file;
		this.name = name;
	}

	async reload() {
		const mon = this.client.monitors.load(this.dir, this.file);
		mon.init();
		return mon;
	}

	run() {
		// Defined in extension Classes
	}

	init() {
		// Optionally defined in extension Classes
	}

};
