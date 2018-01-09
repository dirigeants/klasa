const Cron = require('../util/Cron');

/**
 * The structure for future tasks to be run
 */
class ScheduledTask {

	/**
	 * @typedef  {Object} ScheduledTaskOptions
	 * @property {string} [id]
	 * @property {Date} [time]
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
		this.repeat = options.repeat;

		/**
		 * @type {?Cron}
		 */
		this.recurring = options.repeat ? new Cron(options.repeat) : null;

		/**
		 * @type {?Date}
		 */
		this.time = options.time instanceof Date ? options.time : this.recurring ? this.recurring.next() : null;

		/**
		 * @type {string}
		 */
		this.id = options.id || this.constructor._generateID(this.client, this.time);

		/**
		 * @type {*}
		 */
		this.data = options.data;

		this.constructor.validate(this);
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

	update({ repeat, time, data } = {}) {
		if (repeat) {
			this.repeat = repeat;
			this.recurring = new Cron(repeat);
			this.time = this.recurring.next();
		}
		if (time) this.time = time;
		if (data) this.data = data;
		this.store.sync(this);
	}

	static _generateID(client, time) {
		return Buffer.from(`${time}${client.sharded ? client.shard.id : ''}`).toString('hex');
	}

	static validate(st) {
		if (!this.task) throw new Error('invalid task');
		if (!st.time) throw new Error('time or repeat option required');
	}


}

module.exports = ScheduledTask;
