const ScheduledTask = require('./ScheduledTask');

class Schedule {

	/**
	 * @typedef  {Object} ScheduledTaskOptions
	 * @property {string} [id]
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
		 * The Client instance that initialized this instance
		 * @since 0.5.0
		 * @type {KlasaClient}
		 */
		this.client = client;

		/**
		 * An array of all processed ScheduledTask instances
		 * @since 0.5.0
		 * @type {ScheduledTask[]}
		 */
		this.tasks = [];

		/**
		 * The time in milliseconds for the delay between interval executions
		 * @since 0.5.0
		 * @type {number}
		 */
		this.timeInterval = this.client.options.schedule.interval;

		/**
		 * The current interval that runs the tasks
		 * @since 0.5.0
		 * @type {NodeJS.Timer}
		 * @private
		 */
		this._interval = null;
	}

	/**
	 * Get all the tasks from the cache
	 * @since 0.5.0
	 * @type {ScheduledTaskOptions[]}
	 * @private
	 */
	get _tasks() {
		return this.client.configs.schedules;
	}

	/**
	 * Init the Schedule
	 * @since 0.5.0
	 */
	async init() {
		const { schema } = this.client.gateways.clientStorage;
		if (!schema.hasKey('schedules')) {
			await schema.addKey('schedules', {
				type: 'any',
				default: [],
				min: null,
				max: null,
				array: true,
				configurable: false,
				sql: 'TEXT'
			});
		}

		const tasks = this._tasks;
		if (!tasks || !Array.isArray(tasks)) return;

		for (const task of tasks) {
			try {
				this._add(task.taskName, task.repeat || task.time, task);
			} catch (error) {
				this.client.emit('warn', `Task ${task.taskName} [${task.id}] was not queued: ${error}`);
			}
		}

		this._checkInterval();
	}

	/**
	 * Execute the current tasks
	 * @since 0.5.0
	 */
	async execute() {
		// Do not execute if the Client is not available
		if (this.client.status !== 0) return;
		if (this.tasks.length) {
			// Process the active tasks, they're sorted by the time they end
			const now = Date.now();
			const execute = [];
			for (const task of this.tasks) {
				if (task.time.getTime() > now) break;
				execute.push(task.run());
			}

			// Check if the Schedule has a task to run and run them if they exist
			if (execute.length === 0) return;
			await Promise.all(execute);
		}
		this._checkInterval();
	}

	/**
	 * Returns the next ScheduledTask from the id
	 * @param {string} id The id of the ScheduledTask you want
	 * @returns {ScheduledTask}
	 */
	get(id) {
		return this.tasks.find(entry => entry.id === id);
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
	 * @param {(Date|number|string)} time The time or Cron pattern
	 * @param {ScheduledTaskOptions} options The options for the ScheduleTask instance
	 * @returns {Promise<ScheduledTask>}
	 * @example
	 * // Create a new reminder that ends in 2018-03-09T12:30:00.000Z (UTC)
	 * Schedule.create('reminder', new Date(Date.UTC(2018, 2, 9, 12, 30)), {
	 *     data: {
	 *         user: '242043489611808769',
	 *         db_id: 'jbifpb4f'
	 *     }
	 * });
	 *
	 * // Create a scheduled task that runs once a week
	 * Schedule.create('backup', '@weekly');
	 *
	 * // Or even, a weekly backup on Tuesday and Friday that fires at 00:00 (UTC)
	 * Schedule.create('backup', '0 0 * * tue,fri');
	 *
	 * // NOTE: It's highly advised ScheduledTaskOptions.data to be a small object or string,
	 * // as it being larger can cause a slowdown and memory increase. You can, however, have
	 * // a table in your database and query it by its entry id from the Task instance.
	 * @see https://en.wikipedia.org/wiki/Cron For more details
	 */
	async create(taskName, time, options) {
		const task = this._add(taskName, time, options);
		await this.client.configs.update('schedules', task.toJSON(), { action: 'add' });
		return task;
	}

	/**
	 * Delete a Task by its ID
	 * @since 0.5.0
	 * @param {string} id The ID to search for
	 * @returns {Promise<this>}
	 */
	async delete(id) {
		const _task = this._tasks.find(entry => entry.id === id);
		if (!_task) throw new Error('This task does not exist.');

		// Get the task and use it to remove
		await this.client.configs.update('schedules', _task, { action: 'remove' });

		// Remove the task from the current cache if successful
		this.tasks.splice(this.tasks.findIndex(entry => entry.id === id), 1);

		return this;
	}

	/**
	 * Clear all the ScheduledTasks
	 * @since 0.5.0
	 */
	async clear() {
		// this._tasks is unedited as Configuration#clear will clear the array
		await this.client.configs.reset('schedules');
		this.tasks = [];
	}

	/**
	 * Adds a task to the cache
	 * @since 0.5.0
	 * @param {string} taskName The name of the task
	 * @param {(Date|number|string)} time The time or Cron pattern
	 * @param {ScheduledTaskOptions} options The options for the ScheduledTask instance
	 * @returns {ScheduledTask}
	 * @private
	 */
	_add(taskName, time, options) {
		const task = new ScheduledTask(this.client, taskName, time, options);
		this._insert(task);
		this._checkInterval();
		return task;
	}

	/**
	 * Inserts the ScheduledTask instance in its sorted position for optimization
	 * @since 0.5.0
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

	/**
	 * Clear the current interval
	 * @since 0.5.0
	 * @private
	 */
	_clearInterval() {
		clearInterval(this._interval);
		this._interval = null;
	}

	/**
	 * Sets the interval when needed
	 * @since 0.5.0
	 * @private
	 */
	_checkInterval() {
		if (this.tasks.length === 0) this._clearInterval();
		else if (!this._interval) this._interval = this.client.setInterval(this.execute.bind(this), this.timeInterval);
	}

}

module.exports = Schedule;
