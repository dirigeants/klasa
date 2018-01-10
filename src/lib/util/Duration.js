/**
 * Converts duration strings into ms and future dates
 */
class Duration {

	constructor(str) {
		this.offset = this.constructor.parse(str);
	}

	get fromNow() {
		return this.dateFrom(new Date());
	}

	dateFrom(date) {
		return new Date(date.getTime() + this.offset);
	}

	static parse(str) {
		let result = 0;
		// ignore commas
		str = str.replace(/(\d),(\d)/g, '$1$2');
		str.replace(Duration.regex, (match, i, units) => {
			units = Duration[units] || Duration[units.toLowerCase().replace(/s$/, '')] || 1;
			result += parseFloat(i, 10) * units;
		});
		return result;
	}

}

module.exports = Duration;

Duration.regex = /(-?\d*\.?\d+(?:e[-+]?\d+)?)\s*([a-zμ]*)/ig;

/**
 * conversion ratios
 */

/* eslint-disable id-length */

Duration.nanosecond =
Duration.ns = 1 / 1e6;

Duration.μs =
Duration.microsecond = 1 / 1e3;

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

Duration.b =
Duration.month = Duration.d * (365.25 / 12);

Duration.year =
Duration.yr =
Duration.y = Duration.d * 365.25;

/* eslint-enable id-length */
