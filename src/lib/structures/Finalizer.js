module.exports = class Finalizer {

	constructor(client, dir, file, name) {
		this.client = client;
		this.dir = dir;
		this.file = file;
		this.name = name;
	}

	async reload() {
		const fin = this.client.finalizers.load(this.dir, this.file);
		fin.init();
		return fin;
	}

	run() {
		// Defined in extension Classes
	}

	init() {
		// Optionally defined in extension Classes
	}

};
