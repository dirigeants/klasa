/**
 * Permission levels
 * @extends Map
 */
class PermissionLevels extends Map {

	/**
	 * @typedef {object} permLevel
	 * @property {boolean} break Whether the level should break (stop processing higher levels, and inhibit a no permission error)
	 * @property {Function} check The permission checking function
	 */

	/**
	 * Creates a new PermissionLevels
	 * @param {number} levels How many permission levels there should be
	 */
	constructor(levels = 11) {
		super();

		/**
		 * The amount of permission levels
		 * @type {number}
		 */
		this.requiredLevels = levels;

		for (let i = 0; i < this.requiredLevels; i++) {
			this.set(i, { break: false, check: () => false });
		}
	}

	/**
	 * Adds levels to the levels cache to be converted to valid permission structure
	 * @param {number} level The permission number for the level you are defining
	 * @param {boolean} brk Whether the level should break (stop processing higher levels, and inhibit a no permission error)
	 * @param {Function} check The permission checking function
	 * @returns {PermissionLevels} This permission levels
	 */
	addLevel(level, brk, check) {
		return this.set(level, { break: brk, check });
	}

	/**
	 * Checks if all permission levels are valid
	 * @return {boolean}
	 */
	isValid() {
		return this.every(level => {
			if (typeof level !== 'object') return false;
			if (typeof level.break !== 'boolean') return false;
			if (typeof level.check !== 'function') return false;
			return true;
		});
	}

	/**
	 * Checks if all permission levels are valid
	 * @return {string} Error message(s)
	 */
	debug() {
		const errors = [];
		this.forEach((level, index) => {
			if (typeof level !== 'object') {
				errors.push(`Permission level ${index} must be an object`);
			}
			if (typeof level.break !== 'boolean') {
				errors.push(`"break" in permission level ${index} must be a boolean`);
			}
			if (typeof level.check !== 'function') {
				errors.push(`"check" in permission level ${index} must be a function`);
			}
		});
		return errors.join('\n');
	}

	/**
	* Identical to
	* [Array.every()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every).
	* @param {Function} fn Function used to test (should return a boolean)
	* @param {Object} [thisArg] Value to use as `this` when executing function
	* @returns {boolean}
	*/
	every(fn, thisArg) {
		if (thisArg) fn = fn.bind(thisArg);
		for (const [key, val] of this) {
			if (!fn(val, key, this)) return false;
		}
		return true;
	}

}

module.exports = PermissionLevels;
