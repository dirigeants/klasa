const { resolve, join } = require('path');
const { Collection } = require('discord.js');
const fs = require('fs-nextra');
const Command = require('../structures/Command');

module.exports = class CommandStore extends Collection {

	constructor(client) {
		super();
		this.client = client;
		this.aliases = new Collection();
		this.coreDir = join(this.client.coreBaseDir, 'commands');
		this.userDir = join(this.client.clientBaseDir, 'commands');
	}

	get help() {
		return this.map(command => ({ name: command.name, usage: command.parsedUsage.fullUsage, description: command.description }));
	}

	get(name) {
		return super.get(name) || this.aliases.get(name);
	}

	has(name) {
		return super.has(name) || this.aliases.has(name);
	}

	set(command) {
		if (!(command instanceof Command)) return this.client.emit('error', 'Only commands may be stored in the CommandStore.');
		const existing = this.get(command.name);
		if (existing) existing.delete();
		super.set(command.help.name, command);
		command.conf.aliases.forEach(alias => this.aliases.set(alias, command));
		return command;
	}

	delete(name) {
		const command = this.resolve(name);
		if (!command) return false;
		super.delete(command.help.name);
		command.conf.aliases.forEach(alias => this.aliases.delete(alias));
		return true;
	}

	clear() {
		super.clear();
		this.aliases.clear();
	}

	init() {
		return Promise.all(this.map(piece => piece.init()));
	}

	resolve(name) {
		if (name instanceof Command) return name;
		return this.get(name);
	}

	load(dir, file) {
		const cmd = this.set(new (require(join(dir, ...file)))(this.client, dir, file));
		delete require.cache[join(dir, ...file)];
		return cmd;
	}

	async loadAll() {
		this.clear();
		await CommandStore.walk(this, this.coreDir);
		await CommandStore.walk(this, this.userDir);
		return [this.size, this.aliases.size];
	}

	static async walk(store, dir) {
		const files = await fs.readdir(dir).catch(() => { fs.ensureDir(dir).catch(err => store.client.emit('errorlog', err)); });
		if (!files) return false;
		files.filter(file => file.endsWith('.js')).map(file => store.load([file]));
		const subfolders = [];
		const mps1 = files.filter(file => !file.includes('.')).map(async (folder) => {
			const subFiles = await fs.readdir(resolve(dir, folder));
			if (!subFiles) return true;
			subFiles.filter(file => !file.includes('.')).forEach(subfolder => subfolders.push({ folder: folder, subfolder: subfolder }));
			return subFiles.filter(file => file.endsWith('.js')).map(file => store.load([folder, file]));
		});
		await Promise.all(mps1).catch(err => { throw err; });
		const mps2 = subfolders.map(async (subfolder) => {
			const subSubFiles = await fs.readdir(resolve(dir, subfolder.folder, subfolder.subfolder));
			if (!subSubFiles) return true;
			return subSubFiles.filter(file => file.endsWith('.js')).map(file => store.load([subfolder.folder, subfolder.subfolder, file]));
		});
		return Promise.all(mps2).catch(err => { throw err; });
	}


};
