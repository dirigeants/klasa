const Resolver = require('./Resolver');

/**
 * The setting resolver
 * @extends Resolver
 */
class SettingResolver extends Resolver {

	/**
	 * Resolves a user
	 * @param {any} data The data to resolve
	 * @param {external:Guild} guild The guild to resolve for
	 * @returns {external:User}
	 */
	async user(data, guild) {
		const result = await super.user(data);
		if (!result) throw guild.language.get('SETTING_RESOLVER_INVALID_USER');
		return result;
	}

	/**
	 * Resolves a channel
	 * @param {any} data The data to resolve
	 * @param {external:Guild} guild The guild to resolve for
	 * @returns {external:Channel}
	 */
	async channel(data, guild) {
		const result = await super.channel(data);
		if (!result) throw guild.language.get('SETTING_RESOLVER_INVALID_CHANNEL');
		return result;
	}

	/**
	 * Resolves a guild
	 * @param {any} data The data to resolve
	 * @param {external:Guild} guild The guild to resolve for
	 * @returns {external:Guild}
	 */
	async guild(data, guild) {
		const result = await super.guild(data);
		if (!result) throw guild.language.get('SETTING_RESOLVER_INVALID_GUILD');
		return result;
	}

	/**
	 * Resolves a role
	 * @param {any} data The data to resolve
	 * @param {external:Guild} guild The guild to resolve for
	 * @returns {external:Role}
	 */
	async role(data, guild) {
		const result = await super.role(data, guild) || guild.roles.find('name', data);
		if (!result) throw guild.language.get('SETTING_RESOLVER_INVALID_ROLE');
		return result;
	}

	/**
	 * Resolves a boolean
	 * @param {any} data The data to resolve
	 * @param {external:Guild} guild The guild to resolve for
	 * @returns {boolean}
	 */
	async boolean(data, guild) {
		const result = await super.boolean(data);
		if (!result) throw guild.language.get('SETTING_RESOLVER_INVALID_BOOLEAN');
		return result;
	}

	/**
	 * Resolves a string
	 * @param {any} data The data to resolve
	 * @param {external:Guild} guild The guild to resolve for
	 * @param {Object} minMax The minimum and maximum
	 * @param {?number} minMax.min The minumum value
	 * @param {?number} minMax.max The maximum value
	 * @returns {string}
	 */
	async string(data, guild, { min, max }) {
		const result = await super.string(data);
		SettingResolver.maxOrMin(guild, result.length, min, max).catch((err) => { throw guild.language.get('SETTING_RESOLVER_STRING_MAXMIN', err); });
		return result;
	}

	/**
	 * Resolves a integer
	 * @param {any} data The data to resolve
	 * @param {external:Guild} guild The guild to resolve for
	 * @param {Object} minMax The minimum and maximum
	 * @param {?number} minMax.min The minumum value
	 * @param {?number} minMax.max The maximum value
	 * @returns {number}
	 */
	async integer(data, guild, { min, max }) {
		const result = await super.integer(data);
		if (!result) throw guild.language.get('SETTING_RESOLVER_INVALID_INTEGER');
		SettingResolver.maxOrMin(guild, result, min, max).catch((err) => { throw guild.language.get('SETTING_RESOLVER_INTEGER_MAXMIN', err); });
		return result;
	}

	/**
	 * Resolves a float
	 * @param {any} data The data to resolve
	 * @param {external:Guild} guild The guild to resolve for
	 * @param {Object} minMax The minimum and maximum
	 * @param {?number} minMax.min The minumum value
	 * @param {?number} minMax.max The maximum value
	 * @returns {number}
	 */
	async float(data, guild, { min, max }) {
		const result = await super.float(data);
		if (!result) throw guild.language.get('SETTING_RESOLVER_INVALID_FLOAT');
		SettingResolver.maxOrMin(guild, result, min, max).catch((err) => { throw guild.language.get('SETTING_RESOLVER_FLOAT_MAXMIN', err); });
		return result;
	}

	/**
	 * Resolves a hyperlink
	 * @param {any} data The data to resolve
	 * @param {external:Guild} guild The guild to resolve for
	 * @returns {string}
	 */
	async url(data, guild) {
		const result = await super.url(data);
		if (!result) throw guild.language.get('SETTING_RESOLVER_INVALID_URL');
		return result;
	}

	/**
	 * Resolves a command
	 * @param {any} data The data to resolve
	 * @param {external:Guild} guild The guild to resolve for
	 * @returns {Command}
	 */
	async command(data, guild) {
		const command = this.client.commands.get(data.toLowerCase());
		if (!command) throw guild.language.get('SETTING_RESOLVER_INVALID_COMMAND');
		return command.name;
	}

	/**
	 * Check if the input is valid with min and/or max values.
	 * @static
	 * @param {external:Guild} guild The guild to resolve for
	 * @param {number} value The value to check.
	 * @param {?number} min Min value.
	 * @param {?number} max Max value.
	 * @returns {?boolean}
	 */
	static async maxOrMin(guild, value, min, max) {
		if (min && max) {
			if (value >= min && value <= max) return true;
			if (min === max) throw guild.language.get('SETTING_RESOLVER_MINMAX_EXACTLY', min);
			throw guild.language.get('SETTING_RESOLVER_MINMAX_BOTH', min, max);
		} else if (min) {
			if (value >= min) return true;
			throw guild.language.get('SETTING_RESOLVER_MINMAX_MIN', min);
		} else if (max) {
			if (value <= max) return true;
			throw guild.language.get('SETTING_RESOLVER_MINMAX_MAX', max);
		}
		return null;
	}

}

module.exports = SettingResolver;
