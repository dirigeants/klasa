const Cron = require('../util/Cron');

/**
 * The structure for future tasks to be run
 */
class ScheduledTask {

	/**
	 * @typedef  {Object} ScheduledTaskOptions
	 * @property {string} id
	 * @property {Date} [time]
	 * @property {boolean} [utc=false]
	 * @property {string} [repeat]
	 * @property {*} [data]
	 */

	/**
	 * Initializes a new ScheduledTask
	 * @since 0.5.0
	 * @param {KlasaClient} client The client that initialized this instance
	 * @param {string} task The task this ScheduledTask is for
	 * @param {ScheduledTaskOptions} options The options for this ScheduledTask instance
	 */
	constructor(client, task, options) {
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
		Object.defineProperty(this, 'store', { value: client.schedule });

		/**
		 * @since 0.5.0
		 * @type {Task}
		 */
		this.task = this.client.tasks.get(task);

		/**
		 * @type {string}
		 */
		this.id = options.id;

		/**
		 * @type {boolean}
		 */
		this.utc = Boolean(options.utc);

		/**
		 * @type {string}
		 */
		this.repeat = options.repeat;

		/**
		 * @type {?Cron}
		 */
		this.recurring = options.repeat ? new Cron(options.repeat) : null;

		/**
		 * @type {?Date}
		 */
		this.time = options.time instanceof Date ? options.time : null;

		/**
		 * @type {*}
		 */
		this.data = options.data;
	}

	async run() {
		try {
			await this.task.run(this.data);
		} catch (err) {
			this.client.emit('taskError', this, this.task, err);
		}
		if (!this.recurring) return this.delete();
		return this.update({ time: this.recurring.next() });
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
