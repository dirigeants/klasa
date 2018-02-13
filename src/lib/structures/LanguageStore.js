const Language = require('./Language');
const Store = require('./interfaces/Store');

/**
 * Stores all languages for use in Klasa
 * @extends Store
 */
class LanguageStore extends Store {

	/**
	 * Constructs our LanguageStore for use in Klasa
	 * @since 0.2.1
	 * @param {KlasaClient} client The Klasa client
	 */
	constructor(client) {
		super(client, 'languages', Language);
	}

	/**
	 * The default language set in KlasaClientOptions.language
	 * @since 0.2.1
	 * @type {Language}
	 * @readonly
	 */
	get default() {
		return this.get(this.client.options.language);
	}

	/**
	 * Deletes a language from the store
	 * @since 0.2.1
	 * @param {Language|string} name The language object or a string representing the structure this store caches
	 * @returns {boolean} whether or not the delete was successful.
	 */
	delete(name) {
		const language = this.resolve(name);
		if (!language) return false;
		super.delete(language.name);
		return true;
	}

	/**
	 * Sets up a language in our store.
	 * @since 0.2.1
	 * @param {Language} language The language object we are setting up
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

}

module.exports = LanguageStore;
