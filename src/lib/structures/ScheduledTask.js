const Cron = require('../util/Cron');

/**
 * The structure for future tasks to be run
 */
class ScheduledTask {

	/**
	 * @typedef  {Object} ScheduledTaskOptions
	 * @property {string} [id]
	 * @property {(Date|number)} [time]
	 * @property {string} [repeat]
	 * @property {*} [data]
	 * @memberof ScheduledTask
	 */

	/**
	 * @typedef  {Object} ScheduledTaskUpdateOptions
	 * @property {string} [repeat]
	 * @property {Date} [time]
	 * @property {*} [data]
	 * @memberof ScheduledTask
	 */

	/**
	 * @typedef  {Object} ScheduledTaskJSON
	 * @property {string} id
	 * @property {string} taskName
	 * @property {string} [repeat]
	 * @property {number} [time]
	 * @property {*} [data]
	 * @memberof ScheduledTask
	 */

	/**
	 * Initializes a new ScheduledTask
	 * @since 0.5.0
	 * @param {KlasaClient} client The client that initialized this instance
	 * @param {string} taskName The name of the task this ScheduledTask is for
	 * @param {ScheduledTaskOptions} options The options for this ScheduledTask instance
	 */
	constructor(client, taskName, options) {
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
		 * @type {Clock}
		 * @readonly
		 */
		Object.defineProperty(this, 'store', { value: client.clock });

		/**
		 * @since 0.5.0
		 * @type {Task}
		 */
		this.task = this.client.tasks.get(taskName);

		/**
		 * @since 0.5.0
		 * @type {?string}
		 */
		this.repeat = options.repeat;

		/**
		 * @since 0.5.0
		 * @type {?Cron}
		 */
		this.recurring = options.repeat ? new Cron(options.repeat) : null;

		/**
		 * @since 0.5.0
		 * @type {?Date}
		 */
		this.time = options.time instanceof Date ? options.time :
			typeof options.time === 'number' ? new Date(options.time) :
				this.recurring ? this.recurring.next() : null;

		/**
		 * @since 0.5.0
		 * @type {string}
		 */
		this.id = options.id || this.constructor._generateID(this.client, this.time);

		/**
		 * @since 0.5.0
		 * @type {*}
		 */
		this.data = 'data' in options ? options.data : null;

		this.constructor._validate(this);
	}

	/**
	 * Run the current task and bump it if needed
	 * @since 0.5.0
	 * @returns {Promise<this>}
	 */
	async run() {
		try {
			await this.task.run(this.data);
		} catch (err) {
			this.client.emit('taskError', this, this.task, err);
		}
		if (!this.recurring) return this.delete();
		return this.update({ time: this.recurring.next() });
	}

	/**
	 * Update the task
	 * @since 0.5.0
	 * @param {ScheduledTaskUpdateOptions} options The options to update
	 * @returns {Promise<this>}
	 */
	async update({ repeat, time, data } = {}) {
		if (repeat) {
			this.repeat = repeat;
			this.recurring = new Cron(repeat);
			this.time = this.recurring.next();
		}
		if (time) this.time = time;
		if (data) this.data = data;

		// Sync the database if some of the properties changed or the time changed manually
		// (recurring tasks bump the time automatically)
		if (repeat || data || (time && !this.recurring)) await this.store.sync(this);
		// TODO (kyranet): Make Configuration#update able to edit an entry from an array.

		return this;
	}

	/**
	 * Delete the task
	 * @since 0.5.0
	 * @returns {Promise<this>}
	 */
	async delete() {
		const index = this.store._tasks.findIndex(entry => entry.id === this.id);
		if (index === -1) throw new Error('This task does not exist.');

		// Get the task and use it to remove
		const _task = this.store._tasks[index];
		await this.client.configs.update('schedule', _task, undefined, { action: 'remove' });

		// Remove the task from the current cache if successful
		this.tasks.splice(this.tasks.findIndex(entry => entry.id === this.id), 1);

		return this;
	}

	/**
	 * Override for JSON.stringify
	 * @since 0.5.0
	 * @returns {ScheduledTaskJSON}
	 */
	toJSON() {
		const object = { id: this.id, taskName: this.task };
		if (this.recurring) object.repeat = this.repeat;
		else if (this.time) object.time = this.time.getTime();
		if (this.data !== undefined) object.data = this.data;

		return object;
	}

	/**
	 * Generate a new ID based on timestamp and shard
	 * @since 0.5.0
	 * @param {KlasaClient} client The Discord client
	 * @param {(Date|number)} time The time
	 * @returns {string}
	 * @private
	 */
	static _generateID(client, time) {
		if (time === null) time = Date.now();
		else if (time instanceof Date) time.getTime();
		return Buffer.from(`${time}${client.shard ? client.shard.id : ''}`).toString('hex');
	}

	/**
	 * Validate a task
	 * @since 0.5.0
	 * @param {ScheduledTask} st The task to validate
	 * @private
	 */
	static _validate(st) {
		if (!st.task) throw new Error('invalid task');
		if (!st.time) throw new Error('time or repeat option required');
	}


}

module.exports = ScheduledTask;
