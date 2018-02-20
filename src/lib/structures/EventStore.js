const Event = require('./Event');
const Store = require('./base/Store');

/**
 * Stores all the events that a part of Klasa
 * @extends Store
 */
class EventStore extends Store {

	/**
	 * Constructs our EventStore for use in Klasa
	 * @since 0.0.1
	 * @param {KlasaClient} client The klasa client initializing this store.
	 */
	constructor(client) {
		super(client, 'events', Event);
	}

	/**
	 * Clears the events from the store and removes the listeners.
	 * @since 0.0.1
	 * @returns {void}
	 */
	clear() {
		for (const event of this.values()) this.delete(event);
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
		return super.delete(event);
	}

	/**
	 * Sets up an event in our store.
	 * @since 0.0.1
	 * @param {Event} piece The event piece we are setting up
	 * @returns {?Event}
	 */
	set(piece) {
		const event = super.set(piece);
		if (!event) return undefined;
		if (event.once) this.client.once(event.name, event._runOnce.bind(event));
		else this.client.on(event.name, event._run.bind(event));
		return event;
	}

}

module.exports = EventStore;
