const Inhibitor = require('./Inhibitor');
const Store = require('./interfaces/Store');

/**
 * Stores all the inhibitors in Klasa
 * @extends Store
 */
class InhibitorStore extends Store {

	/**
	 * Constructs our InhibitorStore for use in Klasa
	 * @since 0.0.1
	 * @param {KlasaClient} client The Klasa Client
	 */
	constructor(client) {
		super(client, 'inhibitors', Inhibitor);
	}

	/**
	 * Deletes a inhibitor from the store
	 * @since 0.0.1
	 * @param {Inhibitor|string} name The inhibitor object or a string representing the structure this store caches
	 * @returns {boolean} whether or not the delete was successful.
	 */
	delete(name) {
		const inhibitor = this.resolve(name);
		if (!inhibitor) return false;
		super.delete(inhibitor.name);
		return true;
	}

	/**
	 * Runs our inhibitors on the command.
	 * @since 0.0.1
	 * @param {KlasaMessage} msg The message object from Discord.js
	 * @param {Command} cmd The command being ran.
	 * @param {boolean} [selective=false] Whether or not we should ignore certain inhibitors to prevent spam.
	 * @returns {void}
	 */
	async run(msg, cmd, selective = false) {
		const mps = [];
		for (const inhibitor of this.values()) if (inhibitor.enabled && (!selective || !inhibitor.spamProtection)) mps.push(inhibitor.run(msg, cmd).catch(err => err));
		const results = (await Promise.all(mps)).filter(res => res);
		if (results.includes(true)) throw undefined;
		if (results.length > 0) throw results.join('\n');
		return undefined;
	}

	/**
	 * Sets up a inhibitor in our store.
	 * @since 0.0.1
	 * @param {Inhibitor} inhibitor The inhibitor object we are setting up
	 * @returns {Inhibitor}
	 */
	set(inhibitor) {
		if (!(inhibitor instanceof this.holds)) return this.client.emit('error', `Only ${this.name} may be stored in the Store.`);
		const existing = this.get(inhibitor.name);
		if (existing) this.delete(existing);
		else if (this.client.listenerCount('pieceLoaded')) this.client.emit('pieceLoaded', inhibitor);
		super.set(inhibitor.name, inhibitor);
		return inhibitor;
	}

}

module.exports = InhibitorStore;
