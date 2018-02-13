const Finalizer = require('./Finalizer');
const Store = require('./interfaces/Store');

/**
 * Stores all finalizers for use in Klasa.
 * @extends Store
 */
class FinalizerStore extends Store {

	/**
	 * Constructs our FinalizerStore for use in Klasa
	 * @since 0.0.1
	 * @param {KlasaClient} client The Klasa client
	 */
	constructor(client) {
		super(client, 'finalizers', Finalizer);
	}

	/**
	 * Deletes a finalizer from the store
	 * @since 0.0.1
	 * @param {Finalizer|string} name The finalizer object or a string representing the structure this store caches
	 * @returns {boolean} whether or not the delete was successful.
	 */
	delete(name) {
		const finalizer = this.resolve(name);
		if (!finalizer) return false;
		super.delete(finalizer.name);
		return true;
	}

	/**
	 * Runs all of our finalizers after a command is ran successfully.
	 * @since 0.0.1
	 * @param {KlasaMessage} msg The message that called the command
	 * @param {KlasaMessage|any} mes The response of the command
	 * @param {StopWatch} timer The timer run from start to queue of the command
	 * @returns {void}
	 */
	async run(msg, mes, timer) {
		for (const finalizer of this.values()) {
			if (finalizer.enabled) {
				try {
					await finalizer.run(msg, mes, timer);
				} catch (err) {
					this.client.emit('finalizerError', msg, mes, timer, finalizer, err);
				}
			}
		}
	}

	/**
	 * Sets up a finalizer in our store.
	 * @since 0.0.1
	 * @param {Finalizer} finalizer The finalizer object we are setting up
	 * @returns {Finalizer}
	 */
	set(finalizer) {
		if (!(finalizer instanceof this.holds)) return this.client.emit('error', `Only ${this.name} may be stored in the Store.`);
		const existing = this.get(finalizer.name);
		if (existing) this.delete(existing);
		else if (this.client.listenerCount('pieceLoaded')) this.client.emit('pieceLoaded', finalizer);
		super.set(finalizer.name, finalizer);
		return finalizer;
	}

}

module.exports = FinalizerStore;
