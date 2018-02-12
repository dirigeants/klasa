const { Collection } = require('discord.js');
const Event = require('./Event');
const Store = require('./interfaces/Store');

/**
 * Stores all the events that a part of Klasa
 * @extends external:Collection
 * @implements {Store}
 */
class EventStore extends Collection {

	/**
	 * Constructs our EventStore for use in Klasa
	 * @since 0.0.1
	 * @param {KlasaClient} client The klasa client initializing this store.
	 */
	constructor(client) {
		super();

		/**
		 * The client this EventStore was created with.
		 * @since 0.0.1
		 * @name EventStore#client
		 * @type {KlasaClient}
		 * @readonly
		 */
		Object.defineProperty(this, 'client', { value: client });

		/**
		 * The type of structure this store holds
		 * @since 0.1.1
		 * @type {Event}
		 */
		this.holds = Event;

		/**
		 * The name of what this holds
		 * @since 0.3.0
		 * @type {string}
		 */
		this.name = 'events';
	}

	/**
	 * Clears the events from the store and removes the listeners.
	 * @since 0.0.1
	 * @returns {void}
	 */
	clear() {
		for (const event of this.keys()) this.delete(event);
	}

	/**
	 * Deletes an event from the store.
	 * @since 0.0.1
	 * @param {Event|string} name An event object or a string representing the event name.
	 * @returns {boolean} whether or not the delete was successful.
	 */
	delete(name) {
		const event = this.resolve(name);
		if (!event) return false;
		this.client.removeAllListeners(event.name);
		super.delete(event.name);
		return true;
	}

	/**
	 * Sets up an event in our store.
	 * @since 0.0.1
	 * @param {Event} event The event object we are setting up
	 * @returns {Event}
	 */
	set(event) {
		if (!(event instanceof Event)) return this.client.emit('error', 'Only events may be stored in the EventStore.');
		const existing = this.get(event.name);
		if (existing) this.delete(existing);
		else if (this.client.listenerCount('pieceLoaded')) this.client.emit('pieceLoaded', event);
		this.client.on(event.name, event._run.bind(event));
		super.set(event.name, event);
		return event;
	}

	// left for documentation
	/* eslint-disable no-empty-function */
	get coreDir() {}
	get userDir() {}
	init() {}
	load() {}
	async loadAll() {}
	resolve() {}
	/* eslint-enable no-empty-function */

}

Store.applyToClass(EventStore);

module.exports = EventStore;
