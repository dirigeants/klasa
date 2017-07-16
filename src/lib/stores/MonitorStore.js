const { join } = require('path');
const { Collection } = require('discord.js');
const fs = require('fs-nextra');
const Monitor = require('../structures/Monitor');

module.exports = class MonitorStore extends Collection {

	constructor(client) {
		super();
		this.client = client;
		this.coreDir = join(this.client.coreBaseDir, 'monitors');
		this.userDir = join(this.client.clientBaseDir, 'monitors');
	}

	set(monitor) {
		if (!(monitor instanceof Monitor)) return this.client.emit('error', 'Only monitors may be stored in the MonitorStore.');
		super.set(monitor.name, monitor);
		return monitor;
	}

	init() {
		return Promise.all(this.map(piece => piece.init()));
	}

	resolve(name) {
		if (name instanceof Monitor) return name;
		return this.get(name);
	}

	load(dir, file) {
		const mon = this.set(new (require(join(dir, file)))(this.client, dir, file));
		delete require.cache[join(dir, file)];
		return mon;
	}

	async loadAll() {
		this.clear();
		const coreFiles = await fs.readdir(this.coreDir).catch(() => { fs.ensureDir(this.coreDir).catch(err => this.client.emit('errorlog', err)); });
		if (coreFiles) await Promise.all(coreFiles.map(this.load.bind(this, this.coreDir)));
		const userFiles = await fs.readdir(this.userDir).catch(() => { fs.ensureDir(this.userDir).catch(err => this.client.emit('errorlog', err)); });
		if (userFiles) await Promise.all(userFiles.map(this.load.bind(this, this.userDir)));
		return this.size;
	}

	run(...args) {
		this.forEach(finalizer => finalizer.run(...args));
	}

};
