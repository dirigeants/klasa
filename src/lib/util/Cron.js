const { cron: { allowedNum, partRegex, day, predefined, tokens, tokensRegex } } = require('./constants');

class Cron {

	/**
	 * Cron Format
	 * -----------
	 * *	*	*	*	*	*
	 * |	|	|	|	|	|day of week(0-6)
	 * |	|	|	|	|month(1-12)
	 * |	|	|	|day of month(1-31)
	 * |	|	|hour(0-23)
	 * |	|minute(0-59)
	 * |seconds(0-59)
	 * *	- all the options for that field
	 * * /2- starting from the first option, every other option
	 * 0	- only use the explicitly provided option
	 * 2,4 - use list of values provided, separated by comma
	 */

	constructor(cron) {
		this.cron = this.constructor._normalize(cron.toLowerCase());
		[this.seconds, this.minutes, this.hours, this.days, this.months, this.dows] = this.constructor._parseString(this.cron);
	}

	next(zDay = new Date(), origin = true) {
		if (this.days.includes(zDay.getUTCDate()) && this.months.includes(zDay.getUTCMonth() + 1) && this.dows.includes(zDay.getUTCDay())) {
			const now = new Date(zDay.getTime() + 1000);
			const [hour] = origin ? this.hours.filter(hr => hr >= now.getUTCHours()) : this.hours;
			const [minute] = origin ? this.minutes.filter(min => min >= now.getUTCMinutes()) : this.minutes;
			const [second] = origin ? this.seconds.filter(sec => sec >= now.getUTCSeconds()) : this.seconds;
			if (typeof hour !== 'undefined' && typeof hour !== 'undefined' && typeof second !== 'undefined') {
				return new Date(Date.UTC(zDay.getUTCFullYear(), zDay.getUTCMonth(), zDay.getUTCDate(), hour, minute, second));
			}
		}
		return this.next(new Date(zDay.getTime() + day), false);
	}

	static _normalize(cron) {
		if (cron in predefined) return predefined[cron];
		return cron.replace(tokensRegex, match => tokens[match]);
	}

	static _parseString(cron) {
		cron = cron.split(' ');
		if (cron.length !== 6) throw new Error('Invalid Cron Provided');
		return cron.map(Cron._parsePart);
	}

	static _parsePart(cronPart, id) {
		if (cronPart.includes(',')) {
			const res = [];
			for (const part of cronPart.split(',')) res.push(...Cron._parsePart(part, id));
			return res;
		}

		// eslint-disable-next-line prefer-const
		let [, wild, min, max, step] = partRegex.exec(cronPart);

		if (wild) [min, max] = allowedNum[id];
		else if (!max && !step) return [parseInt(min)];
		return Cron._range(parseInt(min), parseInt(max) || allowedNum[id][1], parseInt(step) || 1);
	}

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
