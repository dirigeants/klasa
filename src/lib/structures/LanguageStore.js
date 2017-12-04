const { join } = require('path');
const { Collection } = require('discord.js');
const Language = require('./Language');
const Store = require('./interfaces/Store');

/**
 * Stores all languages for use in Klasa
 * @extends external:Collection
 * @implements {Store}
 */
class LanguageStore extends Collection {

	/**
	 * Constructs our LanguageStore for use in Klasa
	 * @since 0.2.1
	 * @param  {KlasaClient} client The Klasa client
	 */
	constructor(client) {
		super();

		/**
		 * The client this LanguageStore was created with.
		 * @since 0.2.1
		 * @name LanguageStore#client
		 * @type {KlasaClient}
		 * @readonly
		 */
		Object.defineProperty(this, 'client', { value: client });

		/**
		 * The directory of languages in Klasa relative to where its installed.
		 * @since 0.2.1
		 * @type {String}
		 */
		this.coreDir = join(this.client.coreBaseDir, 'languages');

		/**
		 * The directory of local languages relative to where you run Klasa from.
		 * @since 0.2.1
		 * @type {String}
		 */
		this.userDir = join(this.client.clientBaseDir, 'languages');

		/**
		 * The type of structure this store holds
		 * @since 0.2.1
		 * @type {Language}
		 */
		this.holds = Language;

		/**
		 * The name of what this holds
		 * @since 0.3.0
		 * @type {String}
		 */
		this.name = 'languages';
	}

	/**
	 * The default language
	 * @since 0.2.1
	 * @readonly
	 * @return {Language} The default language set in KlasaClient.config
	 */
	get default() {
		return this.get(this.client.config.language);
	}

	/**
	 * Deletes a language from the store
	 * @since 0.2.1
	 * @param  {Finalizer|string} name The language object or a string representing the structure this store caches
	 * @return {boolean} whether or not the delete was successful.
	 */
	delete(name) {
		const finalizer = this.resolve(name);
		if (!finalizer) return false;
		super.delete(finalizer.name);
		return true;
	}

	/**
	 * Sets up a language in our store.
	 * @since 0.2.1
	 * @param {Language} language The finalizer object we are setting up.
	 * @returns {Language}
	 */
	set(language) {
		if (!(language instanceof this.holds)) return this.client.emit('error', `Only ${this.name} may be stored in the Store.`);
		const existing = this.get(language.name);
		if (existing) this.delete(existing);
		else if (this.client.listenerCount('pieceLoaded')) this.client.emit('pieceLoaded', language);
		super.set(language.name, language);
		return language;
	}

	// left for documentation
	/* eslint-disable no-empty-function */
	init() {}
	load() {}
	async loadAll() {}
	resolve() {}
	/* eslint-enable no-empty-function */

}

Store.applyToClass(LanguageStore);

module.exports = LanguageStore;
