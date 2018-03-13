const { Structures } = require('discord.js');

module.exports = Structures.extend('User', User => {
	/**
	 * Klasa's Extended User
	 * @extends external:User
	 */
	class KlasaUser extends User {

		/**
		 * @param {...*} args Normal D.JS User args
		 */
		constructor(...args) {
			super(...args);

			/**
			 * The user level configs for this context
			 * @since 0.5.0
			 * @type {Configuration}
			 */
			this.configs = this.client.gateways.users.get(this.id, true);
		}

	}

	return KlasaUser;
});
