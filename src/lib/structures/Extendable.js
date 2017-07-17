const Discord = require('discord.js');

/**
 * Base class for all Klasa Extendables. See {@tutorial CreatingExtendables} for more information how to use this class
 * to build custom extendables.
 * @tutorial CreatingExtendables
 */
class Extendable {

	/**
	 * @param {KlasaClient} client The klasa client
	 * @param {string} dir The path to the core or user extendable pieces folder
	 * @param {string} file The path from the pieces folder to the extendable file
	 * @param {string} name The name of the extendable
	 * @param {string[]} appliesTo The discord classes this extendable applies to
	 */
	constructor(client, dir, file, name, appliesTo = []) {
		this.client = client;
		this.dir = dir;
		this.file = file;
		this.name = name;
		this.type = 'extendable';
		this.appliesTo = appliesTo;
	}

	/**
	 * The extend method to be overwritten in actual extend pieces
	 * @param {any} params Any parameters you want
	 * @abstract
	 * @returns {any}
	 */
	extend() {
		// Defined in extension Classes
	}

	/**
	 * The init method to apply the extend method to the Discord.js Class
	 * @private
	 */
	async init() {
		for (const structure of this.appliesTo) Object.defineProperty(Discord[structure].prototype, this.name, Object.getOwnPropertyDescriptor(this.constructor.prototype, 'extend'));
	}

}

module.exports = Extendable;
