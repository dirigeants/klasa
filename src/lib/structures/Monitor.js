module.exports = class Monitor {

	constructor(client, dir, file, name, { enabled = true }) {
		this.client = client;
		this.dir = dir;
		this.file = file;
		this.name = name;
		this.type = 'monitor';
		this.enabled = enabled;
	}

	async reload() {
		const mon = this.client.monitors.load(this.dir, this.file);
		await mon.init();
		return mon;
	}

	unload() {
		return this.client.monitors.delete(this);
	}

	disable() {
		this.enabled = false;
		return this;
	}

	enable() {
		this.enabled = true;
		return this;
	}

	run() {
		// Defined in extension Classes
	}

	init() {
		// Optionally defined in extension Classes
	}

};
