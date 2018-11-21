const { Collection } = require('discord.js');

/**
 * Permission levels. See {@tutorial UnderstandingPermissionLevels} for more information how to use this class
 * to define custom permissions.
 * @extends external:Collection
 * @tutorial UnderstandingPermissionLevels
 */
class PermissionLevels extends Collection {

	/**
	 * @typedef {Object} PermissionLevelsData
	 * @property {boolean} broke Whether the loop broke execution of higher levels
	 * @property {boolean} permission Whether the permission level check passed or not
	 */

	/**
	 * @typedef {Object} PermissionLevelOptions
	 * @property {boolean} [break=false] Whether the loop breaks execution of higher levels
	 * @property {boolean} [fetch=false] Whether the permission level should autofetch a member or not
	 */

	/**
	 * Adds levels to the levels cache
	 * @since 0.2.1
	 * @param {number} level The permission number for the level you are defining
	 * @param {Function} check The permission checking function
	 * @param {PermissionLevelOptions} [options={}] If the permission should auto fetch members
	 * @returns {this}
	 */
	add(level, check, options = {}) {
		return this.set(level, { check, break: Boolean(options.break), fetch: Boolean(options.fetch) });
	}

	/**
	 * Removes levels from the levels cache
	 * @since 0.5.0
	 * @param {number} level The permission number for the level you are removing
	 * @returns {this}
	 */
	remove(level) {
		this.delete(level);
		return this;
	}

	/**
	 * Adds levels to the levels cache to be converted to valid permission structure
	 * @since 0.2.1
	 * @param {number} level The permission number for the level you are defining
	 * @param {PermissionLevelOptions} obj Whether the level should break (stop processing higher levels, and inhibit a no permission error)
	 * @returns {this}
	 * @private
	 */
	set(level, obj) {
		if (level < 0) throw new Error(`Cannot set permission level ${level}. Permission levels start at 0.`);
		return super.set(level, obj).sort();
	}

	/**
	 * Checks if all permission levels are valid
	 * @since 0.2.1
	 * @returns {boolean}
	 */
	isValid() {
		return this.every(level => typeof level === 'object' && typeof level.break === 'boolean' && typeof level.fetch === 'boolean' && typeof level.check === 'function');
	}

	/**
	 * Returns any errors in the perm levels
	 * @since 0.2.1
	 * @returns {string} Error message(s)
	 */
	debug() {
		const errors = [];
		for (const [index, level] of this) {
			if (typeof level !== 'object') errors.push(`Permission level ${index} must be an object`);
			if (typeof level.break !== 'boolean') errors.push(`"break" in permission level ${index} must be a boolean`);
			if (typeof level.fetch !== 'boolean') errors.push(`"fetch" in permission level ${index} must be a boolean`);
			if (typeof level.check !== 'function') errors.push(`"check" in permission level ${index} must be a function`);
		}
		return errors.join('\n');
	}

	/**
	 * Runs the defined permissionLevels
	 * @since 0.2.1
	 * @param {KlasaMessage} message The message to pass to perm level functions
	 * @param {number} min The minimum permissionLevel ok to pass
	 * @returns {PermissionLevelsData}
	 */
	async run(message, min) {
		for (const [index, level] of this) {
			if (index < min) continue;
			if (level.fetch && !message.member && message.guild) await message.guild.members.fetch(message.author);
			const res = await level.check(message);
			if (res) return { broke: false, permission: true };
			if (level.break) return { broke: true, permission: false };
		}
		return { broke: false, permission: false };
	}

	/**
	 * Does an in-place sort
	 * @since 0.5.0
	 * @returns {this}
	 */
	sort() {
		const entries = [...this.entries()].sort((a, b) => a[0] - b[0]);
		this.clear();
		for (const [key, value] of entries) this.set(key, value);
		return this;
	}

	static get [Symbol.species]() {
		return Collection;
	}

}

module.exports = PermissionLevels;
