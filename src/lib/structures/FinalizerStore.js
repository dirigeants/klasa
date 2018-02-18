const Finalizer = require('./Finalizer');
const Store = require('./base/Store');

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
	 * Runs all of our finalizers after a command is ran successfully.
	 * @since 0.0.1
	 * @param {KlasaMessage} msg The message that called the command
	 * @param {KlasaMessage|any} mes The response of the command
	 * @param {StopWatch} timer The timer run from start to queue of the command
	 * @returns {void}
	 */
	run(msg, mes, timer) {
		for (const finalizer of this.values()) if (finalizer.enabled) this._run(finalizer, msg, mes, timer);
	}

	/**
	 * Run a finalizer and catch any uncaught promises
	 * @since 0.5.0
	 * @param {Finalizer} finalizer The finalizer to run
	 * @param {KlasaMessage} msg The message that called the command
	 * @param {KlasaMessage|any} mes The response of the command
	 * @param {StopWatch} timer The timer run from start to queue of the command
	 * @private
	 */
	async _run(finalizer, msg, mes, timer) {
		try {
			await finalizer.run(msg, mes, timer);
		} catch (err) {
			this.client.emit('finalizerError', msg, mes, timer, finalizer, err);
		}
	}

}

module.exports = FinalizerStore;
