const Inhibitor = require('./Inhibitor');
const Store = require('./base/Store');

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

}

module.exports = InhibitorStore;
