module.exports = class Provider {

	constructor(client, dir, file, name) {
		this.client = client;
		this.dir = dir;
		this.file = file;
		this.name = name;
	}

	async reload() {
		const pro = this.client.providers.load(this.dir, this.file);
		pro.init();
		return pro;
	}

	run() {
		// Defined in extension Classes
	}

	init() {
		// Optionally defined in extension Classes
	}

};
