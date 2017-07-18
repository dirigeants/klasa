/**
 * Base class for all Klasa Events. See {@tutorial CreatingEvents} for more information how to use this class
 * to build custom events.
 * @tutorial CreatingEvents
 */
class Event {

	/**
	 * @typedef {Object} EventOptions
	 * @property {boolean} [enabled=true] Whether the event is enabled or not
	 */

	/**
	 * @param {KlasaClient} client The klasa client
	 * @param {string} dir The path to the core or user event pieces folder
	 * @param {string} file The path from the pieces folder to the event file
	 * @param {string} name The name of the event
	 * @param {EventOptions} [options={}] The Event options
	 */
	constructor(client, dir, file, name, options = {}) {
		/**
		 * @type {KlasaClient}
		 */
		this.client = client;

		/**
		 * The directory to where this event piece is stored
		 * @type {string}
		 */
		this.dir = dir;

		/**
		 * The file location where this event is stored
		 * @type {string}
		 */
		this.file = file;

		/**
		 * The name of the event
		 * @type {string}
		 */
		this.name = name;

		/**
		 * The type of Klasa piece this is
		 * @type {string}
		 */
		this.type = 'event';

		/**
		 * If the event is enabled or not
		 * @type {boolean}
		 */
		this.enabled = options.enabled || true;
	}

	/**
	 * Reloads this event
	 * @returns {Promise<Event>} The newly loaded event
	 */
	async reload() {
		const evt = this.client.events.load(this.dir, this.file);
		await evt.init();
		return evt;
	}

	/**
	 * Unloads this event
	 * @returns {void}
	 */
	unload() {
		return this.client.events.delete(this);
	}

	/**
	 * Disables this finalizer
	 * @returns {Finalizer} This finalizer
	 */
	disable() {
		this.enabled = false;
		return this;
	}

	/**
	 * Enables this finalizer
	 * @returns {Finalizer} This finalizer
	 */
	enable() {
		this.enabled = true;
		return this;
	}

	/**
	 * A wrapper for the run method, to easily disable/enable events
	 * @param {any} param The event parameters emited
	 * @private
	 * @returns {void}
	 */
	_run(...args) {
		if (this.enabled) this.run(...args);
	}

	/**
	 * The run method to be overwritten in actual event handlers
	 * @param {any} param The event parameters emited
	 * @abstract
	 * @returns {void}
	 */
	run() {
		// Defined in extension Classes
	}

	/**
	 * The init method to be optionaly overwritten in actual events
	 * @abstract
	 * @returns {Promise<void>}
	 */
	async init() {
		// Optionally defined in extension Classes
	}

}

module.exports = Event;
