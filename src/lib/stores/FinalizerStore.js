const { join } = require('path');
const { Collection } = require('discord.js');
const fs = require('fs-nextra');
const Finalizer = require('../structures/Finalizer');

module.exports = class FinalizerStore extends Collection {

	constructor(client) {
		super();
		this.client = client;
		this.coreDir = join(this.client.coreBaseDir, 'finalizers');
		this.userDir = join(this.client.clientBaseDir, 'finalizers');
	}

	set(finalizer) {
		if (!(finalizer instanceof Finalizer)) return this.client.emit('error', 'Only finalizers may be stored in the FinalizerStore.');
		const existing = this.get(finalizer.name);
		if (existing) this.delete(existing);
		super.set(finalizer.name, finalizer);
		return finalizer;
	}

	delete(name) {
		const finalizer = this.resolve(name);
		if (!finalizer) return false;
		super.delete(finalizer.name);
		return true;
	}

	init() {
		return Promise.all(this.map(piece => piece.init()));
	}

	resolve(name) {
		if (name instanceof Finalizer) return name;
		return this.get(name);
	}

	load(dir, file) {
		const fin = this.set(new (require(join(dir, file)))(this.client, dir, file));
		delete require.cache[join(dir, file)];
		return fin;
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
