const Discord = require('discord.js');

class Extendable {

	constructor(client, dir, file, name, appliesTo = []) {
		this.client = client;
		this.dir = dir;
		this.file = file;
		this.name = name;
		this.type = 'extendable';
		this.appliesTo = appliesTo;
	}

	extend() {
		// Defined in extension Classes
	}

	init() {
		for (const structure of this.appliesTo) Object.defineProperty(Discord[structure].prototype, this.name, Object.getOwnPropertyDescriptor(this.constructor.prototype, 'extend'));
	}

}

module.exports = Extendable;
