const { Structures } = require('discord.js');

module.exports = Structures.extend('User', User => {
	/**
     * Klasa's Extended User
     * @extends external:User
     */
	class KlasaUser extends User {

		constructor(...args) {
			super(...args);
			this.configs = this.client.settings.users.get(this.id);
		}

	}

	return KlasaUser;
});
