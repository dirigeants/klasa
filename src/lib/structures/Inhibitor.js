/**
 * Base class for all Klasa Inhibitors. See {@tutorial CreatingInhibitors} for more information how to use this class
 * to build custom inhibitors.
 * @tutorial CreatingInhibitors
 */
class Inhibitor {

	/**
	 * @typedef {Object} InhibitorOptions
	 * @property {string} [name = theFileName] The name of the inhibitor
	 * @property {boolean} [enabled=true] Whether the inhibitor is enabled
	 * @property {boolean} [spamProtection=false] If this inhibitor is meant for spamProtection (disables the inhibitor while generating help)
	 */

	/**
	 * @param {KlasaClient} client The Klasa client
	 * @param {string} dir The path to the core or user inhibitor pieces folder
	 * @param {string} file The path from the pieces folder to the inhibitor file
	 * @param {InhibitorOptions} [options = {}] Optional Inhibitor settings
	 */
	constructor(client, dir, file, options = {}) {
		/**
		 * @type {KlasaClient}
		 */
		this.client = client;

		/**
		 * The directory to where this inhibitor piece is stored
		 * @type {string}
		 */
		this.dir = dir;

		/**
		 * The file location where this inhibitor is stored
		 * @type {string}
		 */
		this.file = file;

		/**
		 * The name of the inhibitor
		 * @type {string}
		 */
		this.name = options.name || file.slice(0, -3);

		/**
		 * The type of Klasa piece this is
		 * @type {string}
		 */
		this.type = 'inhibitor';

		/**
		 * If the inhibitor is enabled or not
		 * @type {boolean}
		 */
		this.enabled = 'enabled' in options ? options.enabled : true;

		/**
		 * If this inhibitor is meant for spamProtection (disables the inhibitor while generating help)
		 * @type {boolean}
		 */
		this.spamProtection = options.spamProtection || false;
	}

	/**
	 * Reloads this inhibitor
	 * @returns {Promise<Inhibitor>} The newly loaded inhibitor
	 */
	async reload() {
		const inh = this.client.inhibitors.load(this.dir, this.file);
		await inh.init();
		return inh;
	}

	/**
	 * Unloads this inhibitor
	 * @returns {void}
	 */
	unload() {
		return this.client.inhibitors.delete(this);
	}

	/**
	 * Disables this inhibitor
	 * @returns {Inhibitor} This inhibitor
	 */
	disable() {
		this.enabled = false;
		return this;
	}

	/**
	 * Enables this inhibitor
	 * @returns {Inhibitor} This inhibitor
	 */
	enable() {
		this.enabled = true;
		return this;
	}

	/**
	 * The run method to be overwritten in actual inhibitors
	 * @param {external:Message} msg The message that triggered this inhibitor
	 * @param {Command} cmd The command to run
	 * @abstract
	 * @returns {Promise<void|string>}
	 */
	run() {
		// Defined in extension Classes
	}

	/**
	 * The init method to be optionaly overwritten in actual inhibitors
	 * @abstract
	 * @returns {Promise<void>}
	 */
	async init() {
		// Optionally defined in extension Classes
	}

}

module.exports = Inhibitor;
