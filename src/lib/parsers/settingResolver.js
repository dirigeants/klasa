const Resolver = require('./Resolver');

/**
 * The setting resolver
 * @extends Resolver
 */
class SettingResolver extends Resolver {

	/**
	 * Resolves a user
	 * @param {any} data The data to resolve
	 * @returns {external:User}
	 */
	async user(data) {
		const result = await super.user(data);
		if (!result) throw 'This key expects a User Object or ID.';
		return result;
	}

	/**
	 * Resolves a channel
	 * @param {any} data The data to resolve
	 * @returns {external:Channel}
	 */
	async channel(data) {
		const result = await super.channel(data);
		if (!result) throw 'This key expects a Channel Object or ID.';
		return result;
	}

	/**
	 * Resolves a guild
	 * @param {any} data The data to resolve
	 * @returns {external:Guild}
	 */
	async guild(data) {
		const result = await super.guild(data);
		if (!result) throw 'This key expects a Guild ID.';
		return result;
	}

	/**
	 * Resolves a role
	 * @param {any} data The data to resolve
	 * @param {external:Guild} guild The guild this setting is for
	 * @returns {external:Role}
	 */
	async role(data, guild) {
		const result = await super.role(data, guild) || guild.roles.find('name', data);
		if (!result) throw 'This key expects a Role Object or ID.';
		return result;
	}

	/**
	 * Resolves a boolean
	 * @param {any} data The data to resolve
	 * @returns {boolean}
	 */
	async boolean(data) {
		const result = await super.boolean(data);
		if (!result) throw 'This key expects a Boolean.';
		return result;
	}

	/**
	 * Resolves a string
	 * @param {any} data The data to resolve
	 * @param {external:Guild} guild The guild this setting is for
	 * @param {{min: ?number, max: ?number}} minMax The minimum and maximum
	 * @returns {string}
	 */
	async string(data, guild, { min, max }) {
		const result = await super.string(data);
		SettingResolver.maxOrMin(result.length, min, max).catch((err) => { throw `The string length must be ${err} characters.`; });
		return result;
	}

	/**
	 * Resolves a integer
	 * @param {any} data The data to resolve
	 * @param {external:Guild} guild The guild this setting is for
	 * @param {{min: ?number, max: ?number}} minMax The minimum and maximum
	 * @returns {number}
	 */
	async integer(data, guild, { min, max }) {
		const result = await super.integer(data);
		if (!result) throw 'This key expects an Integer value.';
		SettingResolver.maxOrMin(result, min, max).catch((err) => { throw `The integer value must be ${err}.`; });
		return result;
	}

	/**
	 * Resolves a float
	 * @param {any} data The data to resolve
	 * @param {external:Guild} guild The guild this setting is for
	 * @param {{min: ?number, max: ?number}} minMax The minimum and maximum
	 * @returns {number}
	 */
	async float(data, guild, { min, max }) {
		const result = await super.float(data);
		if (!result) throw 'This key expects a Float value.';
		SettingResolver.maxOrMin(result, min, max).catch((err) => { throw `The float value must be ${err}.`; });
		return result;
	}

	/**
	 * Resolves a hyperlink
	 * @param {any} data The data to resolve
	 * @returns {string}
	 */
	async url(data) {
		const result = await super.url(data);
		if (!result) throw 'This key expects an URL (Uniform Resource Locator).';
		return result;
	}

	/**
	 * Resolves a command
	 * @param {any} data The data to resolve
	 * @returns {Command}
	 */
	async command(data) {
		const command = this.client.commands.get(data.toLowerCase());
		if (!command) throw 'This key expects a Command.';
		return command.name;
	}

	/**
	 * Check if the input is valid with min and/or max values.
	 * @static
	 * @param {number} value The value to check.
	 * @param {?number} min Min value.
	 * @param {?number} max Max value.
	 * @returns {?boolean}
	 */
	static async maxOrMin(value, min, max) {
		if (min && max) {
			if (value >= min && value <= max) return true;
			if (min === max) throw `exactly ${min}`;
			throw `between ${min} and ${max}`;
		} else if (min) {
			if (value >= min) return true;
			throw `longer than ${min}`;
		} else if (max) {
			if (value <= max) return true;
			throw `shorter than ${max}`;
		}
		return null;
	}

}

module.exports = SettingResolver;
