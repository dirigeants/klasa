const { Structures } = require('discord.js');

module.exports = Structures.extend('User', User => {
	/**
	 * Klasa's Extended User
	 * @extends external:User
	 */
	class KlasaUser extends User {

		/**
		 * @typedef {external:UserJSON} KlasaUserJSON
		 * @property {ConfigurationJSON} configs The per user configs
		 */

		/**
		 * @param {...*} args Normal D.JS User args
		 */
		constructor(...args) {
			super(...args);

			/**
			 * The user level configs for this context (user || default)
			 * @since 0.5.0
			 * @type {Configuration}
			 */
			this.configs = this.client.gateways.users.get(this.id, true);
		}

		/**
		 * Returns the JSON-compatible object of this instance.
		 * @since 0.5.0
		 * @returns {KlasaUserJSON}
		 */
		toJSON() {
			return { ...super.toJSON(), configs: this.configs };
		}

	}

	return KlasaUser;
});
