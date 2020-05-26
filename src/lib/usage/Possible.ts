const regexTypes = ['reg', 'regex', 'regexp'];

/**
 * Represents a possibility in a usage Tag
 */
export class Possible {

	/**
	 * The name of this possible
	 * @since 0.2.1
	 */
	public name: string;

	/**
	 * The type of this possible
	 * @since 0.2.1
	 */
	public type: string;

	/**
	 * The min of this possible
	 * @since 0.2.1
	 */
	public min: number | null;

	/**
	 * The max of this possible
	 * @since 0.2.1
	 */
	public max: number | null;

	/**
	 * The regex of this possible
	 * @since 0.3.0
	 */
	public regex: RegExp | null;

	/**
	 * @param regexResults The regex results from parsing the tag member
	 * @since 0.2.1
	 */
	public constructor([, name, type = 'literal', min, max, regex, flags]: readonly string[]) {
		this.name = name;
		this.type = type;
		this.min = min ? (this.constructor as typeof Possible).resolveLimit(min, 'min') : null;
		this.max = max ? (this.constructor as typeof Possible).resolveLimit(max, 'max') : null;
		this.regex = regexTypes.includes(this.type) && regex ? new RegExp(regex, flags) : null;

		if (regexTypes.includes(this.type) && !this.regex) throw 'Regex types must include a regular expression';
	}

	/**
	 * Resolves a limit
	 * @since 0.2.1
	 * @param limit The limit to evaluate
	 * @param limitType The type of limit
	 */
	private static resolveLimit(limit: string, limitType: string): number {
		const parsed = parseFloat(limit);
		if (Number.isNaN(parsed)) throw `${limitType} must be a number`;
		return parsed;
	}

}
