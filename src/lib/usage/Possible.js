const minMaxTypes = ['str', 'string', 'int', 'integer', 'num', 'number', 'float'];
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
		this.min = minMaxTypes.includes(this.type) && min ? this.constructor.resolveLimit(min, this.type, 'min') : undefined;

		/**
		 * The max of this possible
		 * @since 0.2.1
		 * @type {?number}
		 */
		this.max = minMaxTypes.includes(this.type) && max ? this.constructor.resolveLimit(max, this.type, 'max') : undefined;

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
	 * @param {string} type The type of the usage Possible
	 * @param {string} limitType The type of limit
	 * @returns {number}
	 * @private
	 */
	static resolveLimit(limit, type, limitType) {
		if (isNaN(limit)) throw `${limitType} must be a number`;
		const tempLimit = parseFloat(limit);
		if (minMaxTypes.indexOf(type) <= 3 && tempLimit % 1 !== 0) throw `${limitType} must be an integer for this type.`;
		return tempLimit;
	}

}

module.exports = Possible;
