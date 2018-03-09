/**
 * Converts duration strings into ms and future dates
 */
class Duration {

	/**
	 * Create a new Duration instance
	 * @since 0.5.0
	 * @param {string} pattern The string to parse
	 */
	constructor(pattern) {
		/**
		 * The offset
		 * @since 0.5.0
		 * @type {number}
		 */
		this.offset = Duration._parse(pattern);
	}

	/**
	 * Get the date from now
	 * @since 0.5.0
	 * @type {Date}
	 * @readonly
	 */
	get fromNow() {
		return this.dateFrom(new Date());
	}

	/**
	 * Get the date from
	 * @since 0.5.0
	 * @param {Date} date The Date instance to get the date from
	 * @returns {Date}
	 */
	dateFrom(date) {
		return new Date(date.getTime() + this.offset);
	}

	/**
	 * Parse the pattern
	 * @since 0.5.0
	 * @param {string} pattern The pattern to parse
	 * @returns {number}
	 * @private
	 */
	static _parse(pattern) {
		let result = 0;
		// ignore commas
		pattern = pattern.replace(/(\d),(\d)/g, '$1$2');
		pattern.replace(Duration.regex, (match, i, units) => {
			units = Duration[units] || Duration[units.toLowerCase().replace(/s$/, '')] || 1;
			result += parseFloat(i, 10) * units;
		});
		return result;
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

		return `${returnString + Math.round(duration / 365)} years`;
	}

}

module.exports = Duration;

/**
 * The RegExp used for the pattern parsing
 * @since 0.5.0
 * @type {RegExp}
 * @static
 */
Duration.regex = /(-?\d*\.?\d+(?:e[-+]?\d+)?)\s*([a-zμ]*)/ig;

/**
 * conversion ratios
 */

/* eslint-disable id-length */

Duration.nanosecond =
Duration.ns = 1 / 1e6;

Duration.microsecond =
Duration.μs = 1 / 1e3;

Duration.millisecond =
Duration.ms = 1;

Duration.second =
Duration.sec =
Duration.s = Duration.ms * 1000;

Duration.minute =
Duration.min =
Duration.m = Duration.s * 60;

Duration.hour =
Duration.hr =
Duration.h = Duration.m * 60;

Duration.day =
Duration.d = Duration.h * 24;

Duration.week =
Duration.wk =
Duration.w = Duration.d * 7;

Duration.month =
Duration.b = Duration.d * (365.25 / 12);

Duration.year =
Duration.yr =
Duration.y = Duration.d * 365.25;

/* eslint-enable id-length */
