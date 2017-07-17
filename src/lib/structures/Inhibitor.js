class Inhibitor {

	constructor(client, dir, file, name, options = {}) {
		this.client = client;
		this.dir = dir;
		this.dir = file;
		this.name = name;
		this.type = 'inhibitor';
		this.enabled = options.enabled || true;
		this.spamProtection = options.spamProtection || false;
	}

	async reload() {
		const inh = this.client.inhibitors.load(this.dir, this.file);
		await inh.init();
		return inh;
	}

	unload() {
		this.client.inhibitors.delete(this);
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

}

module.exports = Inhibitor;
