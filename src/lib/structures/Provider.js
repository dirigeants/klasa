module.exports = class Provider {

	constructor(client, dir, file, name, { description = '', enabled = true, sql = false }) {
		this.client = client;
		this.dir = dir;
		this.file = file;
		this.name = name;
		this.type = 'provider';
		this.description = description;
		this.enabled = enabled;
		this.sql = sql;
	}

	async reload() {
		const pro = this.client.providers.load(this.dir, this.file);
		await pro.init();
		return pro;
	}

	unload() {
		return this.client.providers.delete(this);
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
