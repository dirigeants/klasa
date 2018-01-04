// const { Collection } = require('discord.js');
// const RECURRING_TYPES = ['daily', 'weekly', 'monthly', 'yearly'];
// const RECURRING_WEEK_TYPES = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

class ScheduledTask {

	/**
	 * @typedef  {Object} RecurringWeek
	 * @property {Date[]} [monday]
	 * @property {Date[]} [tuesday]
	 * @property {Date[]} [wednesday]
	 * @property {Date[]} [thursday]
	 * @property {Date[]} [friday]
	 * @property {Date[]} [saturday]
	 * @property {Date[]} [sunday]
	 * @memberof ScheduledTask
	 */

	/**
	 * @typedef  {string[]} ScheduledTaskOptionsRecurringDaily
	 * @memberof ScheduledTask
	 */

	/**
	 * @typedef  {Object} ScheduledTaskOptionsRecurringYearly
	 * @property {ScheduledTaskOptionsRecurringMontly} [january]
	 * @property {ScheduledTaskOptionsRecurringMontly} [february]
	 * @property {ScheduledTaskOptionsRecurringMontly} [march]
	 * @property {ScheduledTaskOptionsRecurringMontly} [april]
	 * @property {ScheduledTaskOptionsRecurringMontly} [may]
	 * @property {ScheduledTaskOptionsRecurringMontly} [june]
	 * @property {ScheduledTaskOptionsRecurringMontly} [july]
	 * @property {ScheduledTaskOptionsRecurringMontly} [august]
	 * @property {ScheduledTaskOptionsRecurringMontly} [september]
	 * @property {ScheduledTaskOptionsRecurringMontly} [october]
	 * @property {ScheduledTaskOptionsRecurringMontly} [november]
	 * @property {ScheduledTaskOptionsRecurringMontly} [december]
	 */

	/**
	 * @typedef  {Object} ScheduledTaskOptionsRecurringMontly
	 * @property {ScheduledTaskOptionsRecurringDaily} [d1]
	 * @property {ScheduledTaskOptionsRecurringDaily} [d2]
	 * @property {ScheduledTaskOptionsRecurringDaily} [d3]
	 * @property {ScheduledTaskOptionsRecurringDaily} [d4]
	 * @property {ScheduledTaskOptionsRecurringDaily} [d5]
	 * @property {ScheduledTaskOptionsRecurringDaily} [d6]
	 * @property {ScheduledTaskOptionsRecurringDaily} [d7]
	 * @property {ScheduledTaskOptionsRecurringDaily} [d8]
	 * @property {ScheduledTaskOptionsRecurringDaily} [d9]
	 * @property {ScheduledTaskOptionsRecurringDaily} [d10]
	 * @property {ScheduledTaskOptionsRecurringDaily} [d11]
	 * @property {ScheduledTaskOptionsRecurringDaily} [d12]
	 * @property {ScheduledTaskOptionsRecurringDaily} [d13]
	 * @property {ScheduledTaskOptionsRecurringDaily} [d14]
	 * @property {ScheduledTaskOptionsRecurringDaily} [d15]
	 * @property {ScheduledTaskOptionsRecurringDaily} [d16]
	 * @property {ScheduledTaskOptionsRecurringDaily} [d17]
	 * @property {ScheduledTaskOptionsRecurringDaily} [d18]
	 * @property {ScheduledTaskOptionsRecurringDaily} [d19]
	 * @property {ScheduledTaskOptionsRecurringDaily} [d20]
	 * @property {ScheduledTaskOptionsRecurringDaily} [d21]
	 * @property {ScheduledTaskOptionsRecurringDaily} [d22]
	 * @property {ScheduledTaskOptionsRecurringDaily} [d23]
	 * @property {ScheduledTaskOptionsRecurringDaily} [d24]
	 * @property {ScheduledTaskOptionsRecurringDaily} [d25]
	 * @property {ScheduledTaskOptionsRecurringDaily} [d26]
	 * @property {ScheduledTaskOptionsRecurringDaily} [d27]
	 * @property {ScheduledTaskOptionsRecurringDaily} [d28]
	 * @property {ScheduledTaskOptionsRecurringDaily} [d29]
	 * @property {ScheduledTaskOptionsRecurringDaily} [d30]
	 * @property {ScheduledTaskOptionsRecurringDaily} [d31]
	 * @memberof ScheduledTask
	 */

	/**
	 * @typedef  {Object} ScheduledTaskOptionsRecurringWeekly
	 * @property {string[]} [monday]
	 * @property {string[]} [tuesday]
	 * @property {string[]} [wednesday]
	 * @property {string[]} [thursday]
	 * @property {string[]} [friday]
	 * @property {string[]} [saturday]
	 * @property {string[]} [sunday]
	 * @memberof ScheduledTask
	 */

	/**
	 * @typedef  {Object} ScheduledTaskOptionsRecurring
	 * @property {ScheduledTaskOptionsRecurringDaily} [daily]
	 * @property {ScheduledTaskOptionsRecurringWeekly} [weekly]
	 * @property {ScheduledTaskOptionsRecurringMontly} [montly]
	 * @property {ScheduledTaskOptionsRecurringYearly} [yearly]
	 * @memberof ScheduledTask
	 */

	/**
	 * @typedef  {Object} ScheduledTaskOptions
	 * @property {string} id
	 * @property {Date} [time]
	 * @property {boolean} utc
	 * @property {ScheduledTaskOptionsRecurring} [recurring]
	 * @property {*} [data]
	 */

	/**
	 * Initializes a new ScheduledTask
	 * @since 0.5.0
	 * @param {KlasaClient} client The client that initialized this instance
	 * @param {Schedule} store The store that manages this ScheduledTask instance
	 * @param {ScheduledTaskOptions} options The options for this ScheduledTask instance
	 */
	constructor(client, store, options) {
		/**
		 * @since 0.5.0
		 * @name ScheduledTask#client
		 * @type {KlasaClient}
		 * @readonly
		 */
		Object.defineProperty(this, 'client', { value: client });

		/**
		 * @since 0.5.0
		 * @name ScheduledTask#store
		 * @type {Schedule}
		 * @readonly
		 */
		Object.defineProperty(this, 'store', { value: store });

		/**
		 * @type {string}
		 */
		this.id = options.id;

		/**
		 * @type {?Date}
		 */
		this.time = options.time instanceof Date ? options.time : null;

		/**
		 * @type {boolean}
		 */
		this.utc = options.utc;

		/**
		 * @type {ScheduledTaskOptionsRecurring}
		 */
		this.recurring = options.recurring;

		/**
		 * @type {*}
		 */
		this.data = options.data;
	}

	// _parseRecurringDaily(options) {
	// 	if (!Array.isArray(options)) return [];
	// 	for (const time of options) {
	// 		if (typeof time !== 'string') continue;
	// 	}
	// }

	// _parseMonthObject(time, date) {
	// 	const dates = new Collection();
	// 	for (const key in time) {
	// 		if (!/\w\d{1,2}/.test(key)) throw new TypeError('[INVALID_DAY] The date should match the RegExp \\w\\d{1,2}');
	// 		const day = parseInt(key.slice(1));
	// 		if (day < 1 || day > 31) throw new Error('[INVALID_DAY_NUMBER] The day must be between 1 and 31');
	// 		dates.set(day, time[day].map(timestamp => this._parseHour(timestamp, new Date(date))));
	// 	}
	// }

	// /**
	//  * Parse recurring weeks
	//  * @since 0.5.0
	//  * @param {Object} time The time object
	//  * @param {Date} date The date instance
	//  * @returns {RecurringWeek}
	//  */
	// _parseWeekObject(time, date) {
	// 	const obj = {};
	// 	for (const day of RECURRING_WEEK_TYPES) {
	// 		if (day in time) obj[day] = time[day].map(timestamp => this._parseHour(timestamp, new Date(date)));
	// 	}
	// 	return obj;
	// }

	// /**
	//  * Parse the hour
	//  * @since 0.5.0
	//  * @param {string} time The time to parse
	//  * @param {Date} date The date instance
	//  * @returns {Date}
	//  */
	// _parseHour(time, date) {
	// 	if (typeof time !== 'string') throw new TypeError('[INVALID_HOUR] The hour should be a string');
	// 	const [, hours, minutes, seconds] = /(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?/.exec(time);
	// 	date[this.utc ? 'setUTCHours' : 'setHours'](hours, minutes, seconds);
	// 	return date;
	// }

}

module.exports = ScheduledTask;
