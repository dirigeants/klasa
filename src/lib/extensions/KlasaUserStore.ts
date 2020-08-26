import { UserStore, User } from '@klasa/core';

export class KlasaUserStore extends UserStore {

	/**
	 * Gets a {@link User user} by its ID, then syncs the user's settings instance
	 * @since 0.6.0
	 * @param userID The {@link User user} ID.
	 */
	public async fetch(userID: string): Promise<User> {
		const user = await super.fetch(userID);
		await user.settings.sync();
		return user;
	}

}
