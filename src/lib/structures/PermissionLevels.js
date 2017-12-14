const { Collection } = require('discord.js');

/**
 * Permission levels. See {@tutorial UnderstandingPermissionLevels} for more information how to use this class
 * to define custom permissions.
 * @extends external:Collection
 * @tutorial UnderstandingPermissionLevels
 */
class PermissionLevels extends Collection {

	/**
	 * @typedef {Object} permissionLevelResponse
	 * @property {boolean} broke Whether the loop broke execution of higher levels
	 * @property {boolean} permission Whether the permission level check passed or not
	 * @memberof PermissionLevels
	 */

	/**
	 * Creates a new PermissionLevels
	 * @since 0.2.1
	 * @param {number} levels How many permission levels there should be
	 */
	constructor(levels = 11) {
		super();

		/**
		 * The amount of permission levels
		 * @since 0.2.1
		 * @type {number}
		 */
		this.requiredLevels = levels;

		for (let i = 0; i < this.requiredLevels; i++) {
			this.set(i, { break: false, check: () => false });
		}
	}

	/**
	 * Adds levels to the levels cache to be converted to valid permission structure
	 * @since 0.2.1
	 * @param {number} level The permission number for the level you are defining
	 * @param {boolean} brk Whether the level should break (stop processing higher levels, and inhibit a no permission error)
	 * @param {Function} check The permission checking function
	 * @returns {PermissionLevels} This permission levels
	 */
	addLevel(level, brk, check) {
		return this.set(level, { break: brk, check });
	}

	/**
	 * Adds levels to the levels cache to be converted to valid permission structure
	 * @since 0.2.1
	 * @param {number} level The permission number for the level you are defining
	 * @param {permissionLevelResponse} obj Whether the level should break (stop processing higher levels, and inhibit a no permission error)
	 * @returns {PermissionLevels} This permission levels
	 * @private
	 */
	set(level, obj) {
		if (level < 0) throw new Error(`Cannot set permission level ${level}. Permission levels start at 0.`);
		if (level > (this.requiredLevels - 1)) throw new Error(`Cannot set permission level ${level}. Permission levels stop at ${this.requiredLevels - 1}.`);
		return super.set(level, obj);
	}

	/**
	 * Checks if all permission levels are valid
	 * @since 0.2.1
	 * @return {boolean}
	 */
	isValid() {
		return this.every(level => typeof level === 'object' && typeof level.break === 'boolean' && typeof level.check === 'function');
	}

	/**
	 * Returns any errors in the perm levels
	 * @since 0.2.1
	 * @return {string} Error message(s)
	 */
	debug() {
		const errors = [];
		for (const [level, index] of this) {
			if (typeof level !== 'object') errors.push(`Permission level ${index} must be an object`);
			if (typeof level.break !== 'boolean') errors.push(`"break" in permission level ${index} must be a boolean`);
			if (typeof level.check !== 'function') errors.push(`"check" in permission level ${index} must be a function`);
		}
		return errors.join('\n');
	}

	/**
	 * Runs the defined permLevels
	 * @since 0.2.1
	 * @param {KlasaMessage} msg The message to pass to perm level functions
	 * @param {number} min The minimum permissionLevel ok to pass
	 * @returns {permissionLevelResponse}
	 */
	async run(msg, min) {
		const mps = [];
		let broke = false;
		for (let i = min; i < this.size; i++) {
			mps.push(this.get(i).check(msg.client, msg));
			if (this.get(i).break) {
				broke = true;
				break;
			}
		}
		const responses = await Promise.all(mps);
		const permission = responses.includes(true);
		return { broke, permission };
	}

}

module.exports = PermissionLevels;
