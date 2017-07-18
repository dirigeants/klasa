const { join } = require('path');
const { Collection } = require('discord.js');
const fs = require('fs-nextra');
const Event = require('../structures/Event');
/**
 * Stores all the events that a part of Klasa
 * @extends external:Collection
 */
class EventStore extends Collection {

	/**
	 * Constructs our EventStore for use in Klasa
	 * @param  {KlasaClient} client The klasa client initializing this store.
	 */
	constructor(client) {
		super();
		/**
		 * The client this EventStore was creaated with.
		 * @name EventStore#client
		 * @type {KlasaClient}
		 * @readonly
		 */
		Object.defineProperty(this, 'client', { value: client });

		/**
		 * The directory of events in Klasa relative to where its installled.
		 * @type {String}
		 */
		this.coreDir = join(this.client.coreBaseDir, 'events');

		/**
		* The directory of local events relative to where you run Klasa from.
		 * @type {String}
		 */
		this.userDir = join(this.client.clientBaseDir, 'events');
	}

	/**
	 * Sets up an event in our store.
	 * @param {Event} event The event object we are setting up.
	 * @returns {Event}
	 */
	set(event) {
		if (!(event instanceof Event)) return this.client.emit('error', 'Only events may be stored in the EventStore.');
		const existing = this.get(event.name);
		if (existing) this.delete(existing);
		this.client.on(event.name, event._run.bind(event));
		super.set(event.name, event);
		return event;
	}


	/**
	 * Deletes an event from the store.
	 * @param  {Event|string} name An event object or a string representing the event name.
	 * @return {boolean} whether or not the delete was successful.
	 */
	delete(name) {
		const event = this.resolve(name);
		if (!event) return false;
		this.client.removeAllListeners(event.name);
		super.delete(event.name);
		return true;
	}

	/**
	 * Clears the events from the store and removes the listeners.
	 * @return {void}
	 */
	clear() {
		this.forEach((val, key) => this.delete(key));
	}

	/**
	 * Initializes all of our events.
	 * @return {Promise<Array>}
	 */
	init() {
		return Promise.all(this.map(piece => piece.init()));
	}

	/**
	 * Resolves a string or event into a event object
	 * @param  {Event|string} name The event object or a string representing an event name.
	 * @return {Event}
	 */
	resolve(name) {
		if (name instanceof Event) return name;
		return this.get(name);
	}

	/**
	 * Loads an event into Klasa so it can be saved in this store.
	 * @param  {string} dir  The user directory or the core directory where this file is saved.
	 * @param  {string} file A string showing where the file is located.
	 * @return {Event}
	 */
	load(dir, file) {
		const evt = this.set(new (require(join(dir, file)))(this.client, dir, file));
		delete require.cache[join(dir, file)];
		return evt;
	}

	/**
	 * Loads all of our events from both the user and core directories.
	 * @return {Promise<number>} The number of events loaded into this store.
	 */
	async loadAll() {
		this.clear();
		const coreFiles = await fs.readdir(this.coreDir).catch(() => { fs.ensureDir(this.coreDir).catch(err => this.client.emit('errorlog', err)); });
		if (coreFiles) await Promise.all(coreFiles.map(this.load.bind(this, this.coreDir)));
		const userFiles = await fs.readdir(this.userDir).catch(() => { fs.ensureDir(this.userDir).catch(err => this.client.emit('errorlog', err)); });
		if (userFiles) await Promise.all(userFiles.map(this.load.bind(this, this.userDir)));
		return this.size;
	}

}

module.exports = EventStore;
