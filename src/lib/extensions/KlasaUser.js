const { Structures } = require('discord.js');

module.exports = Structures.extend('User', User => {
	/**
     * Klasa's Extended User
     * @extends external:User
     */
	class KlasaUser extends User {

		constructor(...args) {
			super(...args);

			/**
			 * The guild level configs for this context (guild || default)
			 * @since 0.5.0
			 * @type {SettingsGateway}
			 */
			this.configs = this.client.settings.users.get(this.id);
		}

	}

	return KlasaUser;
});
