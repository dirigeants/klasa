const { Structures } = require('discord.js');

module.exports = Structures.extend('Guild', Guild => {
	/**
	 * Klasa's Extended Guild
	 * @extends external:Guild
	 */
	class KlasaGuild extends Guild {

		/**
		 * @param {...*} args Normal D.JS Guild args
		 */
		constructor(...args) {
			super(...args);

			/**
			 * The guild level configs for this context (guild || default)
			 * @since 0.5.0
			 * @type {Configuration}
			 */
			this.configs = this.client.gateways.guilds.cache.get(this.id) || this.client.gateways.guilds.insertEntry(this.id);
		}

		/**
		 * The language configured for this guild
		 * @type {?Language}
		 */
		get language() {
			return this.client.languages.get(this.configs.language) || null;
		}

	}

	return KlasaGuild;
});
