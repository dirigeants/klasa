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
	 * The default amount of permission levels
	 */
	static get defaultRequiredLevels() {
		return 11;
	}

	/**
	 * Creates a new PermissionLevels
	 * @param {number} levels How many permission levels there should be
	 */
	constructor(levels = PermissionLevels.defaultRequiredLevels) {
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
		/* eslint-disable no-multi-spaces, arrow-body-style, operator-linebreak, indent, no-mixed-spaces-and-tabs */
		return every(this)((level, index) => {
			// Trick to replace a switch case or if else. Condition on the left, what's executed on the right. Last one is default.
			return   typeof level !== 'object'   ? throwE(`Permission level ${index} must be an object`) :
				typeof level.break !== 'boolean'  ? throwE(`"break" in permission level ${index} must be a boolean`) :
				typeof level.check !== 'function' ? throwE(`"check" in permission level ${index} must be a function`)
				                                  : true;
		});
		/* eslint-enable no-multi-spaces, arrow-body-style, operator-linebreak, indent, no-mixed-spaces-and-tabs */
	}

}

const throwE = msg => { throw new Error(msg); };
const every = iterable => func => Array.prototype.every.call(iterable, func);

module.exports = PermissionLevels;
