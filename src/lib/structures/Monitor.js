/**
 * Base class for all Klasa Monitors. See {@tutorial CreatingMonitors} for more information how to use this class
 * to build custom commands.
 * @tutorial CreatingMonitors
 */
class Monitor {

	constructor(client, dir, file, name, options = {}) {
		this.client = client;
		this.dir = dir;
		this.file = file;
		this.name = name;
		this.type = 'monitor';
		this.enabled = options.enabled || true;
		this.ignoreBots = options.ignoreBots || true;
		this.ignoreSelf = options.ignoreSelf || true;
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

}

module.exports = Monitor;
