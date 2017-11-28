const { Structures } = require('discord.js');

module.exports = Structures.extend('Guild', Guild => {
	/**
     * Klasa's Extended Guild
     * @extends external:Guild
     */
	class KlasaGuild extends Guild {

		constructor(...args) {
			super(...args);

			/**
			 * The guild level configs for this context (guild || default)
			 * @since 0.5.0
			 * @type {Settings}
			 */
			this.configs = this.client.settings.guilds.get(this.id);
		}

		get language() {
			return this.client.languages.get(this.configs.language) || this.client.config.language;
		}

	}

	return KlasaGuild;
});
