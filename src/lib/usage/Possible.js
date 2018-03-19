const minMaxTypes = ['str', 'string', 'num', 'number', 'float', 'int', 'integer'];
const intMinMaxTypes = ['str', 'string', 'int', 'integer'];
const regexTypes = ['reg', 'regex', 'regexp'];

/**
 * Represents a possibility in a usage Tag
 */
class Possible {

	/**
	 * @param {string[]} regexResults The regex results from parsing the tag member
	 * @since 0.2.1
	 */
	constructor([, name, type = 'literal', min, max, regex, flags]) {
		/**
		 * The name of this possible
		 * @since 0.2.1
		 * @type {string}
		 */
		this.name = name;

		/**
		 * The type of this possible
		 * @since 0.2.1
		 * @type {string}
		 */
		this.type = type.toLowerCase();

		/**
		 * The min of this possible
		 * @since 0.2.1
		 * @type {?number}
		 */
		this.min = minMaxTypes.includes(this.type) && min ? this.resolveLimit(min, 'min') : undefined;

		/**
		 * The max of this possible
		 * @since 0.2.1
		 * @type {?number}
		 */
		this.max = minMaxTypes.includes(this.type) && max ? this.resolveLimit(max, 'max') : undefined;

		/**
		 * The regex of this possible
		 * @since 0.3.0
		 * @type {?RegExp}
		 */
		this.regex = regexTypes.includes(this.type) && regex ? new RegExp(regex, flags) : undefined;

		if (regexTypes.includes(this.type) && !this.regex) throw 'Regex types must include a regular expression';
	}

	/**
	 * Resolves a limit
	 * @since 0.2.1
	 * @param {string} limit The limit to evaluate
	 * @param {"min"|"max"} limitType The type of limit
	 * @returns {number}
	 * @private
	 */
	resolveLimit(limit, limitType) {
		if (isNaN(limit)) throw `${limitType} must be a number`;
		const tempMin = parseFloat(limit);
		if (intMinMaxTypes.includes(this.type) && tempMin % 1 !== 0) throw `${limitType} must be an integer for this type.`;
		return tempMin;
	}

}

module.exports = Possible;
