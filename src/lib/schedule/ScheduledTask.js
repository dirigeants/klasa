const Cron = require('../util/Cron');

/**
 * The structure for future tasks to be run
 */
class ScheduledTask {

	/**
	 * @typedef  {Object} ScheduledTaskOptions
	 * @property {string} [id]
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
	 * @property {number} time
	 * @property {string} [repeat]
	 * @property {*} [data]
	 * @memberof ScheduledTask
	 */

	/**
	 * Initializes a new ScheduledTask
	 * @since 0.5.0
	 * @param {KlasaClient} client The client that initialized this instance
	 * @param {string} taskName The name of the task this ScheduledTask is for
	 * @param {(Date|number|string)} time The time or Cron pattern
	 * @param {ScheduledTaskOptions} [options={}] The options for this ScheduledTask instance
	 */
	constructor(client, taskName, time, options = {}) {
		const [_time, _recurring] = this.constructor._resolveTime(time);

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
		 * @type {string}
		 */
		this.taskName = taskName;

		/**
		 * @since 0.5.0
		 * @type {?Cron}
		 */
		this.recurring = _recurring;

		/**
		 * @since 0.5.0
		 * @type {?Date}
		 */
		this.time = 'time' in options ? new Date(options.time) : _time;

		/**
		 * @since 0.5.0
		 * @type {string}
		 */
		this.id = options.id || this.constructor._generateID(this.client);

		/**
		 * @since 0.5.0
		 * @type {*}
		 */
		this.data = 'data' in options ? options.data : null;

		this.constructor._validate(this);
	}

	/**
	 * @since 0.5.0
	 * @type {Task}
	 * @readonly
	 */
	get task() {
		return this.client.tasks.get(this.taskName);
	}

	/**
	 * Run the current task and bump it if needed
	 * @since 0.5.0
	 * @returns {Promise<this>}
	 */
	async run() {
		if (!this.task.enabled) return this;
		try {
			await this.task.run(this.data);
		} catch (err) {
			this.client.emit('taskError', this, this.task, err);
		}
		if (!this.recurring) return this.delete();
		return this.update({ time: this.recurring });
	}

	/**
	 * Update the task
	 * @since 0.5.0
	 * @param {ScheduledTaskUpdateOptions} options The options to update
	 * @returns {Promise<this>}
	 */
	async update({ time, data } = {}) {
		const [_time, _cron] = time ? this.constructor._resolveTime(time) : [null, null];
		if (_time) {
			this.time = _time;
			this.store.tasks.splice(this.store.tasks.indexOf(this), 1);
			this.store._insert(this);
		}
		this.recurring = _cron;
		if (data) this.data = data;

		// Sync the database if some of the properties changed or the time changed manually
		// (recurring tasks bump the time automatically)
		const _index = this.store._tasks.findIndex(entry => entry.id === this.id);
		if (_index !== -1) await this.client.configs.update('schedules', this.toJSON(), { arrayPosition: _index });

		return this;
	}

	/**
	 * Delete the task
	 * @since 0.5.0
	 * @returns {Promise<Schedule>}
	 */
	delete() {
		return this.store.delete(this.id);
	}

	/**
	 * Override for JSON.stringify
	 * @since 0.5.0
	 * @returns {ScheduledTaskJSON}
	 */
	toJSON() {
		const object = { id: this.id, taskName: this.taskName, time: this.time.getTime() };
		if (this.recurring) object.repeat = this.recurring.cron;
		if (typeof this.data !== 'undefined') object.data = this.data;

		return object;
	}

	/**
	 * Resolve the time and cron
	 * @since 0.5.0
	 * @param {(Date|number|Cron|string)} time The time or Cron pattern
	 * @returns {any[]}
	 * @private
	 */
	static _resolveTime(time) {
		if (time instanceof Date) return [time, null];
		if (time instanceof Cron) return [time.next(), time];
		if (typeof time === 'number') return [new Date(time), null];
		if (typeof time === 'string') {
			const cron = new Cron(time);
			return [cron.next(), cron];
		}
		throw new Error('invalid time passed');
	}

	/**
	 * Generate a new ID based on timestamp and shard
	 * @since 0.5.0
	 * @param {KlasaClient} client The Discord client
	 * @returns {string}
	 * @private
	 */
	static _generateID(client) {
		return Date.now().toString(36) + (client.shard ? client.shard.id.toString(36) : '') + String.fromCharCode((1 % 26) + 97);
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
