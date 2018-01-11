const { CRON: { allowedNum, partRegex, day, predefined, tokens, tokensRegex } } = require('./constants');

/**
 * Handles Cron strings and generates dates based on the cron string provided.
 * @see https://en.wikipedia.org/wiki/Cron
 */
class Cron {

	/**
	 * @since 0.5.0
	 * @param {string} cron The cron pattern to use
	 */
	constructor(cron) {
		this.cron = this.constructor._normalize(cron.toLowerCase());
		[this.minutes, this.hours, this.days, this.months, this.dows] = this.constructor._parseString(this.cron);
	}

	/**
	 * Get the next date that matches with the current pattern
	 * @since 0.5.0
	 * @param {Date} zDay The Date instance to compare with
	 * @param {boolean} origin Whether this next call is origin
	 * @returns {Date}
	 */
	next(zDay = new Date(), origin = true) {
		if (this.days.includes(zDay.getUTCDate()) && this.months.includes(zDay.getUTCMonth() + 1) && this.dows.includes(zDay.getUTCDay())) {
			const now = new Date(zDay.getTime() + 60000);
			const hour = origin ? this.hours.find(hr => hr >= now.getUTCHours()) : this.hours[0];
			const minute = origin ? this.minutes.find(min => min >= now.getUTCMinutes()) : this.minutes[0];
			if (typeof hour !== 'undefined' && typeof minute !== 'undefined') {
				return new Date(Date.UTC(zDay.getUTCFullYear(), zDay.getUTCMonth(), zDay.getUTCDate(), hour, minute));
			}
		}
		return this.next(new Date(zDay.getTime() + day), false);
	}

	/**
	 * Normalize the pattern
	 * @since 0.5.0
	 * @param {string} cron The pattern to normalize
	 * @returns {string}
	 * @private
	 */
	static _normalize(cron) {
		if (cron in predefined) return predefined[cron];
		return cron.replace(tokensRegex, match => tokens[match]);
	}

	/**
	 * Parse the pattern
	 * @since 0.5.0
	 * @param {string} cron The pattern to parse
	 * @returns {Array<number[]>}
	 * @private
	 */
	static _parseString(cron) {
		const parts = cron.split(' ');
		if (parts.length !== 5) throw new Error('Invalid Cron Provided');
		return parts.map(Cron._parsePart);
	}

	/**
	 * Parse the current part
	 * @since 0.5.0
	 * @param {string} cronPart The part of the pattern to parse
	 * @param {number} id The id that identifies the current part
	 * @returns {number[]}
	 * @private
	 */
	static _parsePart(cronPart, id) {
		if (cronPart.includes(',')) {
			const res = [];
			for (const part of cronPart.split(',')) res.push(...Cron._parsePart(part, id));
			return [...new Set(res)].sort((a, b) => a - b);
		}

		// eslint-disable-next-line prefer-const
		let [, wild, min, max, step] = partRegex.exec(cronPart);

		if (wild) [min, max] = allowedNum[id];
		else if (!max && !step) return [parseInt(min)];
		return Cron._range(parseInt(min), parseInt(max) || allowedNum[id][1], parseInt(step) || 1);
	}

	/**
	 * Get an array of numbers with the selected range
	 * @since 0.5.0
	 * @param {number} min The minimum value
	 * @param {number} max The maximum value
	 * @param {number} step The step value
	 * @returns {number[]}
	 * @private
	 */
	static _range(min, max, step) {
		if (max < min) {
			const temp = max;
			max = min;
			min = temp;
		}
		const res = new Array(Math.floor((max - min) / step) + 1);
		for (let i = 0; i < res.length; i++) res[i] = min + (i * step);
		return res;
	}

}

module.exports = Cron;
