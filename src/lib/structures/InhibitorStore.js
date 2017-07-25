const { join } = require('path');
const { Collection } = require('discord.js');
const Inhibitor = require('./Inhibitor');
const Store = require('./interfaces/Store');

/**
 * Stores all the inhibitors in Klasa
 * @extends external:Collection
 * @implements {Store}
 */
class InhibitorStore extends Collection {

	/**
	 * Constructs our InhibitorStore for use in Klasa
	 * @param  {KlasaClient} client The Klasa Client
	 */
	constructor(client) {
		super();
		/**
		 * The client this InhibitorStore was created with.
		 * @name InhibitorStore#client
		 * @type {KlasaClient}
		 * @readonly
		 */
		Object.defineProperty(this, 'client', { value: client });

		/**
		 * The directory of inhibitors in Klasa relative to where its installed.
		 * @type {String}
		 */
		this.coreDir = join(this.client.coreBaseDir, 'inhibitors');

		/**
		 * The directory of local inhibitors relative to where you run Klasa from.
		 * @type {String}
		 */
		this.userDir = join(this.client.clientBaseDir, 'inhibitors');

		/**
		 * The type of structure this store holds
		 * @type {Inhibitor}
		 */
		this.holds = Inhibitor;
	}

	/**
	 * Runs our inhibitors on the command.
	 * @param  {external:Message} msg The message object from Discord.js
	 * @param  {Command} cmd The command being ran.
	 * @param  {boolean} [selective=false] Whether or not we should ignore certain inhibitors to prevent spam.
	 * @return {Promise<number>}
	 */
	async run(msg, cmd, selective = false) {
		const mps = [true];
		this.forEach(mProc => {
			if (!mProc.spamProtection && !selective) mps.push(mProc.run(msg, cmd));
		});
		return Promise.all(mps);
	}

	// left for documentation
	/* eslint-disable no-empty-function */
	delete() {}
	init() {}
	load() {}
	async loadAll() {}
	resolve() {}
	set() {}
	/* eslint-enable no-empty-function */

}

Store.applyToClass(InhibitorStore);

module.exports = InhibitorStore;
