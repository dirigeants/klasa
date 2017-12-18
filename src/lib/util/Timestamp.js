const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

/* eslint-disable id-length, complexity */
const TOKENS = {
	Y: 4,
	Q: 1,
	M: 4,
	D: 4,
	d: 1,
	X: 1,
	x: 1,
	H: 2,
	h: 2,
	a: 1,
	A: 1,
	m: 2,
	s: 2,
	S: 3,
	Z: 2
};
/* eslint-enable id-length */

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/**
 * Klasa's Timestamp class, parses the pattern once, displays the desired Date or UNIX timestamp with the selected pattern.
 */
class Timestamp {

	/**
	 * @typedef {Object} TimestampObject
	 * @property {string} type The type of the current variable
	 * @property {string} [content] The content of the type. Only accessible if the type is 'literal'
	 * @memberof Timestamp
	 */

	/**
	 * Starts a new Timestamp and parses the pattern.
	 * @since 0.5.0
	 * @param {string} pattern The pattern to parse
	 */
	constructor(pattern) {
		/**
		 * @since 0.5.0
		 * @type {string}
		 */
		this.pattern = pattern;
		/**
		 * @since 0.5.0
		 * @type {TimestampObject[]}
		 * @private
		 */
		this._template = Timestamp._patch(pattern);
	}

	/**
	 * Display the current date with the current pattern.
	 * @since 0.5.0
	 * @param {(Date|number|string)} [time=new Date()] The time to display
	 * @returns {string}
	 */
	display(time = new Date()) {
		return Timestamp._display(this._template, time);
	}

	/**
	 * Edits the current pattern.
	 * @since 0.5.0
	 * @param {string} pattern The new pattern for this instance
	 * @returns {Timestamp}
	 */
	edit(pattern) {
		this.pattern = pattern;
		this._template = Timestamp._patch(pattern);
		return this;
	}

	/**
	 * Display the current date with the current pattern.
	 * @since 0.5.0
	 * @param {string} pattern The pattern to parse
	 * @param {(Date|number|string)} [time=new Date()] The time to display
	 * @returns {string}
	 */
	static displayArbitrary(pattern, time = new Date()) {
		return Timestamp._display(Timestamp._patch(pattern), time);
	}

	/**
	 * Shows the user friendly duration of time between a period and now.
	 * @since 0.5.0
	 * @param {(Date|number|string)} earlier The time to compare
	 * @param {boolean} [showIn] Whether the output should be prefixed
	 * @returns {string}
	 */
	static toNow(earlier, showIn) {
		if (!(earlier instanceof Date)) earlier = new Date(earlier);
		const returnString = showIn ? 'in ' : '';
		let duration = (Date.now() - earlier) / 1000;

		// Compare the duration in seconds
		if (duration < 45) return `${returnString}seconds`;
		else if (duration < 90) return `${returnString}a minute`;

		// Compare the duration in minutes
		duration /= 60;
		if (duration < 45) return `${returnString + Math.round(duration)} minutes`;
		else if (duration < 90) return `${returnString}an hour`;

		// Compare the duration in hours
		duration /= 60;
		if (duration < 22) return `${returnString + Math.round(duration)} hours`;
		else if (duration < 36) return `${returnString}a day`;

		// Compare the duration in days
		duration /= 24;
		if (duration < 26) return `${returnString + Math.round(duration)} days`;
		else if (duration < 46) return `${returnString}a month`;
		else if (duration < 320) return `${returnString + Math.round(duration / 30)} months`;
		else if (duration < 548) return `${returnString}a year`;

		return `${returnString + Math.floor(duration / 365)} years`;
	}

	/**
	 * Display the current date with the current pattern.
	 * @since 0.5.0
	 * @param {string} template The pattern to parse
	 * @param {(Date|number|string)} time The time to display
	 * @returns {string}
	 * @private
	 */
	static _display(template, time) {
		let output = '';
		const parsedTime = time instanceof Date ? time : new Date(time);
		for (const entry of template) output += entry.content || Timestamp._parse(entry.type, parsedTime);

		return output;
	}

	/**
	 * Parses the current variable.
	 * @since 0.5.0
	 * @param {string} type The type of variable
	 * @param {Date} time The current time
	 * @returns {string}
	 * @private
	 */
	static _parse(type, time) {
		switch (type) {
			// Dates
			case 'Y':
			case 'YY': return String(time.getFullYear()).slice(0, 2);
			case 'YYY':
			case 'YYYY': return String(time.getFullYear());
			case 'Q': return String((time.getMonth() + 1) / 3);
			case 'M':
			case 'MM': return String(time.getMonth() + 1);
			case 'MMM':
			case 'MMMM': return months[time.getMonth()];
			case 'D': return String(time.getDate());
			case 'DD': return String(time.getDate()).padStart(2, '0');
			case 'DDD':
			case 'DDDD': {
				const start = new Date(time.getFullYear(), 0, 0);
				const diff = ((time.getMilliseconds() - start.getMilliseconds()) + (start.getTimezoneOffset() - time.getTimezoneOffset())) * MINUTE;
				return String(Math.floor(diff / DAY));
			}
			case 'd': {
				const day = String(time.getDate());
				if (day !== '11' && day.endsWith('1')) return `${day}st`;
				if (day !== '12' && day.endsWith('2')) return `${day}nd`;
				if (day !== '13' && day.endsWith('3')) return `${day}rd`;
				return `${day}th`;
			}
			case 'X': return String(time.valueOf() / SECOND);
			case 'x': return String(time.valueOf());

			// Times
			case 'H': return String(time.getHours());
			case 'HH': return String(time.getHours()).padStart(2, '0');
			case 'h': return String(time.getHours() % 12);
			case 'hh': return String(time.getHours() % 12).padStart(2, '0');
			case 'a': return time.getHours() < 12 ? 'am' : 'pm';
			case 'A': return time.getHours() < 12 ? 'AM' : 'PM';
			case 'm': return String(time.getMinutes());
			case 'mm': return String(time.getMinutes()).padStart(2, '0');
			case 's': return String(time.getSeconds());
			case 'ss': return String(time.getSeconds()).padStart(2, '0');
			case 'S': return String(time.getMilliseconds());
			case 'SS': return String(time.getMilliseconds()).padStart(2, '0');
			case 'SSS': return String(time.getMilliseconds()).padStart(3, '0');
			case 'Z':
			case 'ZZ': {
				const offset = time.getTimezoneOffset();
				return `${offset >= 0 ? '+' : '-'}${String(offset / -60).padStart(2, '0')}:${String(offset % 60).padStart(2, '0')}`;
			}
			default: return type;
		}
	}

	/**
	 * Parses the pattern.
	 * @since 0.5.0
	 * @param {string} pattern The pattern to parse
	 * @returns {TimestampObject[]}
	 * @private
	 */
	static _patch(pattern) {
		const template = [];
		for (let i = 0; i < pattern.length; i++) {
			let current = '';
			const currentChar = pattern[i];
			if (currentChar in TOKENS) {
				current += currentChar;
				while (pattern[i + 1] === currentChar && current.length < TOKENS[currentChar]) current += pattern[++i];
				template.push({ type: current });
			} else if (currentChar === '[') {
				while (i + 1 < pattern.length && pattern[i + 1] !== ']') current += pattern[++i];
				i++;
				template.push({ type: 'literal', content: current });
			} else {
				current += currentChar;
				while (i + 1 < pattern.length && !(pattern[i + 1] in TOKENS) && pattern[i + 1] !== '[') current += pattern[++i];
				template.push({ type: 'literal', content: current });
			}
		}

		return template;
	}

}

module.exports = Timestamp;
