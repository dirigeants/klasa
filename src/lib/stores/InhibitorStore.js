const { join } = require('path');
const { Collection } = require('discord.js');
const fs = require('fs-nextra');
const Inhibitor = require('../structures/Inhibitor');

module.exports = class InhibitorStore extends Collection {

	constructor(client) {
		super();
		this.client = client;
		this.coreDir = join(this.client.coreBaseDir, 'inhibitors');
		this.userDir = join(this.client.clientBaseDir, 'inhibitors');
	}

	set(inhibitor) {
		if (!(inhibitor instanceof Inhibitor)) return this.client.emit('error', 'Only inhibitors may be stored in the InhibitorStore.');
		const existing = this.get(inhibitor.name);
		if (existing) this.delete(existing);
		super.set(inhibitor.name, inhibitor);
		return inhibitor;
	}

	delete(name) {
		const inhibitor = this.resolve(name);
		if (!inhibitor) return false;
		super.delete(inhibitor.name);
		return true;
	}

	init() {
		return Promise.all(this.map(piece => piece.init()));
	}

	resolve(name) {
		if (name instanceof Inhibitor) return name;
		return this.get(name);
	}

	load(dir, file) {
		const inh = this.set(new (require(join(dir, ...file)))(this.client, dir, ...file));
		delete require.cache[join(dir, ...file)];
		return inh;
	}

	async loadAll() {
		this.clear();
		const coreFiles = await fs.readdir(this.coreDir).catch(() => { fs.ensureDir(this.coreDir).catch(err => this.client.emit('errorlog', err)); });
		if (coreFiles) await Promise.all(coreFiles.map(file => this.load(this.coreDir, [file])));
		const userFiles = await fs.readdir(this.userDir).catch(() => { fs.ensureDir(this.userDir).catch(err => this.client.emit('errorlog', err)); });
		if (userFiles) await Promise.all(userFiles.map(file => this.load(this.userDir, [file])));
		return this.size;
	}

	async run(msg, cmd, selective = false) {
		const mps = [true];
		let i = 1;
		let usage;
		this.forEach((mProc, key) => {
			if (key === 'usage') usage = i;
			if (!mProc.spamProtection && !selective) mps.push(mProc.run(msg, cmd));
			i++;
		});
		return Promise.all(mps).then(value => value[usage]);
	}

};
