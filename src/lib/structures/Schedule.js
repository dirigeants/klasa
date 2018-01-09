const ScheduledTask = require('./ScheduledTask');

class Schedule {

	/**
	 * @typedef  {Object} ScheduledTaskOptions
	 * @property {string} [id]
	 * @property {(Date|number)} [time]
	 * @property {string} [repeat]
	 * @property {*} [data]
	 * @memberof Schedule
	 */

	/**
	 * @since 0.5.0
	 * @param {KlasaClient} client The Client that initialized this instance
	 */
	constructor(client) {
		/**
		 * @since 0.5.0
		 * @type {KlasaClient}
		 */
		this.client = client;

		/**
		 * @since 0.5.0
		 * @type {ScheduledTask[]}
		 */
		this.tasks = [];
	}

	/**
	 * @returns {ScheduledTaskOptions[]}
	 */
	get _tasks() {
		return this.client.configs.schedule;
	}

	/**
	 * Return the next ScheduledTask pending for execution
	 * @returns {ScheduledTask}
	 */
	next() {
		return this.tasks[0];
	}

	/**
	 * Adds a new task to the database
	 * @since 0.5.0
	 * @param {string} taskName The name of the task
	 * @param {ScheduledTaskOptions} options The options for the ScheduleTask instance
	 * @returns {Promise<ScheduledTask>}
	 * @example
	 * // Create a new reminder that ends in 2018-03-09T12:30:00.000Z (UTC)
	 * Schedule.create('reminder', {
	 *     time: new Date(Date.UTC(2018, 2, 9, 12, 30)),
	 *     data: {
	 *         user: '242043489611808769',
	 *         db_id: 'jbifpb4f'
	 *     }
	 * });
	 *
	 * // Create a scheduled task that runs once a week
	 * Schedule.create('backup', {
	 *     repeat: '@weekly'
	 * });
	 *
	 * // Or even, a weekly backup on Tuesday and Friday that fires at 00:00 (UTC)
	 * Schedule.create('backup', {
	 *     repeat: '0 0 0 * * tue,fri'
	 * });
	 *
	 * // NOTE: It's highly adviced ScheduledTaskOptions.data to be a small object or string,
	 * // as it being larger can cause a slowdown and memory increase. You can, however, have
	 * // a table in your database and query it by its entry id from the Task instance.
	 * @see https://en.wikipedia.org/wiki/Cron For more details
	 */
	async create(taskName, options) {
		const task = new ScheduledTask(this.client, taskName, options);
		await this.client.configs.update('schedule', task.toJSON(), undefined, { action: 'add' });
		return this._insert(task);
	}

	/**
	 * Adds a task to the cache
	 * @since 0.5.0
	 * @param {string} taskName The name of the task
	 * @param {ScheduledTaskOptions} options The options for the ScheduledTask instance
	 * @returns {ScheduledTask}
	 */
	add(taskName, options) {
		const task = new ScheduledTask(this.client, taskName, options);
		return this._insert(task);
	}

	/**
	 * Delete a Task by its ID
	 * @since 0.5.0
	 * @param {string} id The ID to search for
	 * @returns {Promise<ScheduledTask>}
	 */
	async delete(id) {
		const task = this.tasks.find(entry => entry.id === id);
		if (!task) throw new Error('This task does not exist.');
		return task.delete();
	}

	/**
	 * Clear all the ScheduledTasks
	 * @since 0.5.0
	 */
	async clear() {
		// this._tasks is unedited as Configuration#update will clear the array
		await this.client.configs.update({ schedule: [] });
		this.tasks = [];
	}

	/**
	 * Inserts the ScheduledTask instance in its sorted position for optimization
	 * @param {ScheduledTask} task The ScheduledTask instance to insert
	 * @returns {ScheduledTask}
	 * @private
	 */
	_insert(task) {
		const index = this.tasks.findIndex(entry => entry.time > task.time);
		if (index === -1) this.tasks.push(task);
		else this.tasks.splice(index, 0, task);
		return task;
	}

}

module.exports = Schedule;
