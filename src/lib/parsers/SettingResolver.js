const Resolver = require('./Resolver');

/**
 * The setting resolver
 * @extends Resolver
 */
class SettingResolver extends Resolver {

	/**
	 * Resolves a user
	 * @since 0.0.1
	 * @param {*} data The data to resolve
	 * @param {KlasaGuild} guild The guild to resolve for
	 * @param {string} name The name of the key being resolved
	 * @returns {KlasaUser}
	 */
	async user(data, guild, name) {
		const result = await super.user(data);
		if (!result) throw (guild ? guild.language : this.client.languages.default).get('RESOLVER_INVALID_USER', name);
		return result;
	}

	/**
	 * Resolves a channel
	 * @since 0.0.1
	 * @param {*} data The data to resolve
	 * @param {KlasaGuild} guild The guild to resolve for
	 * @param {string} name The name of the key being resolved
	 * @returns {external:Channel}
	 */
	async channel(data, guild, name) {
		const result = await super.channel(data);
		if (!result) throw (guild ? guild.language : this.client.languages.default).get('RESOLVER_INVALID_CHANNEL', name);
		return result;
	}

	/**
	 * Resolves a TextChannel
	 * @since 0.3.0
	 * @param {*} data The data to resolve
	 * @param {KlasaGuild} guild The guild to resolve for
	 * @param {string} name The name of the key being resolved
	 * @returns {external:Channel}
	 */
	async textchannel(data, guild, name) {
		const result = await super.channel(data);
		if (!result || result.type !== 'text') throw (guild ? guild.language : this.client.languages.default).get('RESOLVER_INVALID_CHANNEL', name);
		return result;
	}

	/**
	 * Resolves a VoiceChannel
	 * @since 0.3.0
	 * @param {*} data The data to resolve
	 * @param {KlasaGuild} guild The guild to resolve for
	 * @param {string} name The name of the key being resolved
	 * @returns {external:Channel}
	 */
	async voicechannel(data, guild, name) {
		const result = await super.channel(data);
		if (!result || result.type !== 'voice') throw (guild ? guild.language : this.client.languages.default).get('RESOLVER_INVALID_CHANNEL', name);
		return result;
	}

	/**
	 * Resolves a guild
	 * @since 0.0.1
	 * @param {*} data The data to resolve
	 * @param {KlasaGuild} guild The guild to resolve for
	 * @param {string} name The name of the key being resolved
	 * @returns {KlasaGuild}
	 */
	async guild(data, guild, name) {
		const result = await super.guild(data);
		if (!result) throw (guild ? guild.language : this.client.languages.default).get('RESOLVER_INVALID_GUILD', name);
		return result;
	}

	/**
	 * Resolves a role
	 * @since 0.0.1
	 * @param {*} data The data to resolve
	 * @param {KlasaGuild} guild The guild to resolve for
	 * @param {string} name The name of the key being resolved
	 * @returns {external:Role}
	 */
	async role(data, guild, name) {
		const result = await super.role(data, guild) || guild.roles.find('name', data);
		if (!result) throw (guild ? guild.language : this.client.languages.default).get('RESOLVER_INVALID_ROLE', name);
		return result;
	}

	/**
	 * Resolves a boolean
	 * @since 0.0.1
	 * @param {*} data The data to resolve
	 * @param {KlasaGuild} guild The guild to resolve for
	 * @param {string} name The name of the key being resolved
	 * @returns {boolean}
	 */
	async boolean(data, guild, name) {
		const result = await super.boolean(data);
		if (result === null) throw (guild ? guild.language : this.client.languages.default).get('RESOLVER_INVALID_BOOL', name);
		return result;
	}

	/**
	 * Resolves a string
	 * @since 0.0.1
	 * @param {*} data The data to resolve
	 * @param {KlasaGuild} guild The guild to resolve for
	 * @param {string} name The name of the key being resolved
	 * @param {Object} minMax The minimum and maximum
	 * @param {?number} minMax.min The minimum value
	 * @param {?number} minMax.max The maximum value
	 * @returns {string}
	 */
	async string(data, guild, name, { min, max } = {}) {
		const result = await super.string(data);
		if (SettingResolver.maxOrMin(guild, result.length, min, max, name, (guild ? guild.language : this.client.languages.default).get('RESOLVER_STRING_SUFFIX'))) return result;
		return null;
	}

	/**
	 * Resolves a integer
	 * @since 0.0.1
	 * @param {*} data The data to resolve
	 * @param {KlasaGuild} guild The guild to resolve for
	 * @param {string} name The name of the key being resolved
	 * @param {Object} minMax The minimum and maximum
	 * @param {?number} minMax.min The minimum value
	 * @param {?number} minMax.max The maximum value
	 * @returns {number}
	 */
	async integer(data, guild, name, { min, max } = {}) {
		const result = await super.integer(data);
		if (!result) throw (guild ? guild.language : this.client.languages.default).get('RESOLVER_INVALID_INT', name);
		if (SettingResolver.maxOrMin(guild, result, min, max, name)) return result;
		return null;
	}

	/**
	 * Resolves a float
	 * @since 0.0.1
	 * @param {*} data The data to resolve
	 * @param {KlasaGuild} guild The guild to resolve for
	 * @param {string} name The name of the key being resolved
	 * @param {Object} minMax The minimum and maximum
	 * @param {?number} minMax.min The minimum value
	 * @param {?number} minMax.max The maximum value
	 * @returns {number}
	 */
	async float(data, guild, name, { min, max } = {}) {
		const result = await super.float(data);
		if (!result) throw (guild ? guild.language : this.client.languages.default).get('RESOLVER_INVALID_FLOAT', name);
		if (SettingResolver.maxOrMin(guild, result, min, max, name)) return result;
		return null;
	}

	/**
	 * Resolves a hyperlink
	 * @since 0.0.1
	 * @param {*} data The data to resolve
	 * @param {KlasaGuild} guild The guild to resolve for
	 * @param {string} name The name of the key being resolved
	 * @returns {string}
	 */
	async url(data, guild, name) {
		const result = await super.url(data);
		if (!result) throw (guild ? guild.language : this.client.languages.default).get('RESOLVER_INVALID_URL', name);
		return result;
	}

	/**
	 * Resolves a command
	 * @since 0.0.1
	 * @param {*} data The data to resolve
	 * @param {KlasaGuild} guild The guild to resolve for
	 * @param {string} name The name of the key being resolved
	 * @returns {Command}
	 */
	async command(data, guild, name) {
		const command = this.client.commands.get(data.toLowerCase());
		if (!command) throw (guild ? guild.language : this.client.languages.default).get('RESOLVER_INVALID_PIECE', name, 'command');
		return command.name;
	}

	/**
	 * Resolves a language
	 * @since 0.2.1
	 * @param {*} data The data to resolve
	 * @param {KlasaGuild} guild The guild to resolve for
	 * @param {string} name The name of the key being resolved
	 * @returns {Language}
	 */
	async language(data, guild, name) {
		const language = this.client.languages.get(data);
		if (!language) throw (guild ? guild.language : this.client.languages.default).get('RESOLVER_INVALID_PIECE', name, 'language');
		return language.name;
	}

	/**
	 * Resolves anything, even objects.
	 * @since 0.5.0
	 * @param {*} data Raw content to pass
	 * @returns {Promise<*>}
	 */
	any(data) {
		return Promise.resolve(data);
	}

	/**
	 * Check if the input is valid with min and/or max values.
	 * @since 0.0.1
	 * @param {KlasaGuild} guild The guild to resolve for
	 * @param {number} value The value to check
	 * @param {?number} min Min value
	 * @param {?number} max Max value
	 * @param {string} name The name of the key being resolved
	 * @param {string} [suffix=''] The suffix to apply to the error messages
	 * @returns {boolean}
	 * @private
	 */
	static maxOrMin(guild, value, min, max, name, suffix = '') {
		if (min && max) {
			if (value >= min && value <= max) return true;
			if (min === max) throw (guild ? guild.language : this.client.languages.default).get('RESOLVER_MINMAX_EXACTLY', name, min, suffix);
			throw (guild ? guild.language : this.client.languages.default).get('RESOLVER_MINMAX_BOTH', name, min, max, suffix);
		} else if (min) {
			if (value >= min) return true;
			throw (guild ? guild.language : this.client.languages.default).get('RESOLVER_MINMAX_MIN', name, min, suffix);
		} else if (max) {
			if (value <= max) return true;
			throw (guild ? guild.language : this.client.languages.default).get('RESOLVER_MINMAX_MAX', name, max, suffix);
		}
		return true;
	}

}

module.exports = SettingResolver;
