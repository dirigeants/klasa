/**
 * A helper class to building valid permission structures
 */
class PermissionLevels {

	/**
	 * Permission levels indexed from 0-11, based on the level number
	 * @typedef {Array<permLevel>} validPermStructure
	 */

	/**
	 * @typedef {object} permLevel
	 * @property {boolean} break Whether the level should break (stop processing higher levels, and inhibit a no permission error)
	 * @property {Function} check The permission checking function
	 */

	constructor() {
		/**
		 * A cache of levels submitted with addLevel
		 * @type {Map}
		 */
		this.levels = new Map();
	}

	/**
	 * Adds levels to the levels cache to be converted to valid permission structure
	 * @param {number} level The permission number for the level you are defining
	 * @param {boolean} brk Whether the level should break (stop processing higher levels, and inhibit a no permission error)
	 * @param {Function} check The permission checking function
	 * @returns {PermissionLevels} This permission levels
	 */
	addLevel(level, brk, check) {
		if (this.levels.has(level)) throw new Error(`Level ${level} is already defined`);
		this.levels.set(level, { break: brk, check: check });
		return this;
	}

	/**
	 * The current valid permissions structure
	 * @readonly
	 * @type {validPermStructure}
	 */
	get structure() {
		const structure = [];
		for (let i = 0; i < 11; i++) {
			const myLevel = this.levels.get(i);
			if (myLevel) structure.push(myLevel);
			else structure.push({ break: false, check: () => false });
		}
		return structure;
	}

}

module.exports = PermissionLevels;
