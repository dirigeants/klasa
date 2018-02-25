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
		if (result) return result;
		throw (guild ? guild.language : this.client.languages.default).get('RESOLVER_INVALID_USER', name);
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
		if (result) return result;
		throw (guild ? guild.language : this.client.languages.default).get('RESOLVER_INVALID_CHANNEL', name);
	}

	/**
	 * Resolves a TextChannel
	 * @since 0.3.0
	 * @param {*} data The data to resolve
	 * @param {KlasaGuild} guild The guild to resolve for
	 * @param {string} name The name of the key being resolved
	 * @returns {external:TextChannel}
	 */
	async textchannel(data, guild, name) {
		const result = await super.channel(data);
		if (result && result.type === 'text') return result;
		throw (guild ? guild.language : this.client.languages.default).get('RESOLVER_INVALID_CHANNEL', name);
	}

	/**
	 * Resolves a VoiceChannel
	 * @since 0.3.0
	 * @param {*} data The data to resolve
	 * @param {KlasaGuild} guild The guild to resolve for
	 * @param {string} name The name of the key being resolved
	 * @returns {external:VoiceChannel}
	 */
	async voicechannel(data, guild, name) {
		const result = await super.channel(data);
		if (result && result.type === 'voice') return result;
		throw (guild ? guild.language : this.client.languages.default).get('RESOLVER_INVALID_CHANNEL', name);
	}

	/**
	 * Resolves a VoiceChannel
	 * @since 0.3.0
	 * @param {*} data The data to resolve
	 * @param {KlasaGuild} guild The guild to resolve for
	 * @param {string} name The name of the key being resolved
	 * @returns {external:CategoryChannel}
	 */
	async categorychannel(data, guild, name) {
		const result = await super.channel(data);
		if (result && result.type === 'category') return result;
		throw (guild ? guild.language : this.client.languages.default).get('RESOLVER_INVALID_CHANNEL', name);
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
		if (result) return result;
		throw (guild ? guild.language : this.client.languages.default).get('RESOLVER_INVALID_GUILD', name);
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
		const result = await super.role(data, guild) || (guild ? guild.roles.find('name', data) : null);
		if (result) return result;
		throw (guild ? guild.language : this.client.languages.default).get('RESOLVER_INVALID_ROLE', name);
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
		if (typeof result === 'boolean') return result;
		throw (guild ? guild.language : this.client.languages.default).get('RESOLVER_INVALID_BOOL', name);
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
		if (SettingResolver.maxOrMin(this.client, guild, result.length, min, max, name, 'RESOLVER_STRING_SUFFIX')) return result;
		return null;
	}

	/**
	 * Resolves a integer
	 * @since 0.0.1
	 * @param {*} data The data to resolve
	 * @param {KlasaGuild} guild The guild to resolve for
	 * @param {string} name The name of the key being resolved
	 * @param {Object} [minMax={}] The minimum and maximum
	 * @param {?number} minMax.min The minimum value
	 * @param {?number} minMax.max The maximum value
	 * @returns {number}
	 */
	async integer(data, guild, name, { min, max } = {}) {
		const result = await super.integer(data);
		if (result === null) throw (guild ? guild.language : this.client.languages.default).get('RESOLVER_INVALID_INT', name);
		if (SettingResolver.maxOrMin(this.client, guild, result, min, max, name)) return result;
		return null;
	}

	/**
	 * Resolves a float
	 * @since 0.0.1
	 * @param {*} data The data to resolve
	 * @param {KlasaGuild} guild The guild to resolve for
	 * @param {string} name The name of the key being resolved
	 * @param {Object} [minMax={}] The minimum and maximum
	 * @param {?number} minMax.min The minimum value
	 * @param {?number} minMax.max The maximum value
	 * @returns {number}
	 */
	async float(data, guild, name, { min, max } = {}) {
		const result = await super.float(data);
		if (result === null) throw (guild ? guild.language : this.client.languages.default).get('RESOLVER_INVALID_FLOAT', name);
		if (SettingResolver.maxOrMin(this.client, guild, result, min, max, name)) return result;
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
		if (result) return result;
		throw (guild ? guild.language : this.client.languages.default).get('RESOLVER_INVALID_URL', name);
	}

	/**
	 * Resolves a command
	 * @since 0.0.1
	 * @param {*} data The data to resolve
	 * @param {KlasaGuild} guild The guild to resolve for
	 * @param {string} name The name of the key being resolved
	 * @returns {string}
	 */
	async command(data, guild, name) {
		const command = this.client.commands.get(data.toLowerCase());
		if (command) return command.name;
		throw (guild ? guild.language : this.client.languages.default).get('RESOLVER_INVALID_PIECE', name, 'command');
	}

	/**
	 * Resolves a language
	 * @since 0.2.1
	 * @param {*} data The data to resolve
	 * @param {KlasaGuild} guild The guild to resolve for
	 * @param {string} name The name of the key being resolved
	 * @returns {string}
	 */
	async language(data, guild, name) {
		const language = this.client.languages.get(data);
		if (language) return language.name;
		throw (guild ? guild.language : this.client.languages.default).get('RESOLVER_INVALID_PIECE', name, 'language');
	}

	/**
	 * Resolves anything, even objects.
	 * @since 0.5.0
	 * @param {*} data Raw content to pass
	 * @returns {*}
	 */
	async any(data) {
		return data;
	}

	/**
	 * Check if the input is valid with min and/or max values.
	 * @since 0.0.1
	 * @param {KlasaClient} client The client of this bot
	 * @param {KlasaGuild} guild The guild to resolve for
	 * @param {number} value The value to check
	 * @param {number} [min=null] Min value
	 * @param {number} [max=null] Max value
	 * @param {string} name The name of the key being resolved
	 * @param {string} [suffix=''] The suffix to apply to the error messages
	 * @returns {boolean}
	 * @private
	 */
	static maxOrMin(client, guild, value, min = null, max = null, name, suffix) {
		suffix = suffix ? (guild ? guild.language : client.languages.default).get(suffix) : '';
		if (min !== null && max !== null) {
			if (value >= min && value <= max) return true;
			if (min === max) throw (guild ? guild.language : client.languages.default).get('RESOLVER_MINMAX_EXACTLY', name, min, suffix);
			throw (guild ? guild.language : client.languages.default).get('RESOLVER_MINMAX_BOTH', name, min, max, suffix);
		} else if (min !== null) {
			if (value >= min) return true;
			throw (guild ? guild.language : client.languages.default).get('RESOLVER_MINMAX_MIN', name, min, suffix);
		} else if (max !== null) {
			if (value <= max) return true;
			throw (guild ? guild.language : client.languages.default).get('RESOLVER_MINMAX_MAX', name, max, suffix);
		}
		return true;
	}

}

module.exports = SettingResolver;
