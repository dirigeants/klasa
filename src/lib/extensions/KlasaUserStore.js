const { UserStore } = require('discord.js');

/**
 * Contains extensions to the base UserStore class
 * @extends external:UserStore
 */
class KlasaUserStore extends UserStore {

	/**
	 * Fetches a user and syncs their settings
	 * @param  {...any} args d.js UserStore#fetch arguments
	 */
	async fetch(...args) {
		const user = await super.fetch(...args);
		await user.settings.sync();
		return user;
	}

}

module.exports = KlasaUserStore;
