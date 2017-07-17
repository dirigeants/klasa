const { join } = require('path');
const { Collection } = require('discord.js');
const fs = require('fs-nextra');
const Extendable = require('../structures/Extendable');

class ExtendableStore extends Collection {

	constructor(client) {
		super();
		this.client = client;
		this.coreDir = join(this.client.coreBaseDir, 'extendables');
		this.userDir = join(this.client.clientBaseDir, 'extendables');
	}

	set(extendable) {
		if (!(extendable instanceof Extendable)) return this.client.emit('error', 'Only extendables may be stored in the ExtendableStore.');
		extendable.init();
		super.set(extendable.name, extendable);
		return extendable;
	}

	init() {
		return Promise.all(this.map(piece => piece.init()));
	}

	resolve(name) {
		if (name instanceof Extendable) return name;
		return this.get(name);
	}

	load(dir, file) {
		const pro = this.set(new (require(join(dir, file)))(this.client, dir, file));
		delete require.cache[join(dir, file)];
		return pro;
	}

	async loadAll() {
		this.clear();
		const coreFiles = await fs.readdir(this.coreDir).catch(() => { fs.ensureDir(this.coreDir).catch(err => this.client.emit('errorlog', err)); });
		if (coreFiles) await Promise.all(coreFiles.map(this.load.bind(this, this.coreDir)));
		const userFiles = await fs.readdir(this.userDir).catch(() => { fs.ensureDir(this.userDir).catch(err => this.client.emit('errorlog', err)); });
		if (userFiles) await Promise.all(userFiles.map(this.load.bind(this, this.userDir)));
		return this.size;
	}

}

module.exports = ExtendableStore;
