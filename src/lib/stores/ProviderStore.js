const { join } = require('path');
const { Collection } = require('discord.js');
const fs = require('fs-nextra');
const Provider = require('../structures/Provider');

class ProviderStore extends Collection {

	constructor(client) {
		super();
		this.client = client;
		this.coreDir = join(this.client.coreBaseDir, 'providers');
		this.userDir = join(this.client.clientBaseDir, 'providers');
	}

	set(provider) {
		if (!(provider instanceof Provider)) return this.client.emit('error', 'Only providers may be stored in the ProviderStore.');
		const existing = this.get(provider.name);
		if (existing) this.delete(existing);
		super.set(provider.name, provider);
		return provider;
	}

	delete(name) {
		const provider = this.resolve(name);
		if (!provider) return false;
		super.delete(provider.name);
		return true;
	}

	init() {
		return Promise.all(this.map(piece => piece.init()));
	}

	resolve(name) {
		if (name instanceof Provider) return name;
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

module.exports = ProviderStore;
