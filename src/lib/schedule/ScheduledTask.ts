import { isObject } from '@klasa/utils';
import { Cron } from '../util/Cron';
import { Schedule, ScheduledTaskOptions } from './Schedule';
import { Task } from '../structures/Task';
import { KlasaClient } from '../Client';

/**
 * The structure for future tasks to be run
 */
export class ScheduledTask {

	/**
	 * @typedef  {(Date|number|Cron|string)} TimeResolvable
	 */

	/**
	 * @typedef  {Object} ScheduledTaskOptions
	 * @property {string} [id] The ID for the task. By default, it generates one in base36
	 * @property {boolean} [catchUp=true] If the task should try to catch up if the bot is down
	 * @property {*} [data] The data to pass to the Task piece when the ScheduledTask is ready for execution
	 */

	/**
	 * @typedef  {Object} ScheduledTaskUpdateOptions
	 * @property {TimeResolvable} [time] The time or {@link Cron} pattern
	 * @property {boolean} [catchUp] If the task should try to catch up if the bot is down
	 * @property {*} [data] The data to pass to the Task piece when the ScheduledTask is ready for execution
	 */

	/**
	 * @typedef  {Object} ScheduledTaskJSON
	 * @property {string} id The task's ID
	 * @property {string} taskName The name of the Task piece this will execute
	 * @property {number} time The UNIX timestamp for when this task ends at
	 * @property {boolean} catchUp If the task should try to catch up if the bot is down
	 * @property {string} [repeat] The {@link Cron} pattern
	 * @property {Object<string,*>} data The data to pass to the Task piece when the ScheduledTask is ready for execution
	 */

	/**
	 * The Client instance that initialized this instance
	 * @since 0.5.0
	 */
	public client: KlasaClient;

	/**
	 * The name of the Task this scheduled task will run
	 * @since 0.5.0
	 */
	public taskName: string;

	/**
	 * Whether this scheduled task is scheduled with the {@link Cron} pattern
	 * @since 0.5.0
	 */
	public recurring: Cron | null;

	/**
	 * The Date when this scheduled task ends
	 * @since 0.5.0
	 */
	public time: Date;

	/**
	 * The id for this scheduled task
	 * @since 0.5.0
	 */
	public id: string;

	/**
	 * If the task should catch up in the event the bot is down
	 * @since 0.5.0
	 * @type {boolean}
	 */
	public catchUp: boolean;

	/**
	 * The stored metadata to send to the Task
	 * @since 0.5.0
	 */
	public data: Record<string, unknown>;

	/**
	 * If the ScheduledTask is being run currently
	 * @since 0.5.0
	 */
	#running = false;

	/**
	 * Initializes a new ScheduledTask
	 * @since 0.5.0
	 * @param {KlasaClient} client The client that initialized this instance
	 * @param {string} taskName The name of the task this ScheduledTask is for
	 * @param {TimeResolvable} time The time or {@link Cron} pattern
	 * @param {ScheduledTaskOptions} [options={}] The options for this ScheduledTask instance
	 */
	public constructor(client: KlasaClient, taskName: string, time: TimeResolvable, options: ScheduledTaskUpdateOptions = {}) {
		const [_time, _recurring] = (this.constructor as typeof ScheduledTask)._resolveTime(time);

		this.client = client;
		this.taskName = taskName;
		this.recurring = _recurring;
		this.time = _time;
		this.id = options.id || (this.constructor as typeof ScheduledTask)._generateID(this.client);
		this.catchUp = 'catchUp' in options ? options.catchUp : true;
		this.data = 'data' in options && isObject(options.data) ? options.data : {};

		(this.constructor as typeof ScheduledTask)._validate(this);
	}

	/**
	 * The Schedule class that manages all scheduled tasks
	 * @since 0.5.0
	 */
	public get store(): Schedule {
		return this.client.schedule;
	}

	/**
	 * The Task instance this scheduled task will run
	 * @since 0.5.0
	 */
	public get task(): Task | null {
		return this.client.tasks.get(this.taskName) ?? null;
	}

	/**
	 * Run the current task and bump it if needed
	 * @since 0.5.0
	 */
	public async run(): Promise<this> {
		const { task } = this;
		if (!task || !task.enabled || this.#running) return this;

		this.#running = true;
		try {
			await task.run({ id: this.id, ...this.data });
		} catch (err) {
			this.client.emit('taskError', this, task, err);
		}
		this.#running = false;

		if (!this.recurring) return this.delete();
		return this.update({ time: this.recurring });
	}

	/**
	 * Update the task
	 * @since 0.5.0
	 * @param options The options to update
	 * @example
	 * // Update the data from the current scheduled task. Let's say I want to change the reminder content to remind me
	 * // another thing
	 * ScheduledTask.update({ data: { content: 'Woo! I edited this reminder\'s content!' } });
	 *
	 * // But you can also update the time this will end at, for example, to change it so it ends in 1 hour:
	 * ScheduledTask.update({ time: Date.now() + 60000 * 60 });
	 */
	public async update({ time, data, catchUp }: ScheduledTaskUpdateOptions = {}): this {
		if (time) {
			const [_time, _cron] = (this.constructor as typeof ScheduledTask)._resolveTime(time);
			this.time = _time;
			this.store.tasks.splice(this.store.tasks.indexOf(this), 1);
			this.store._insert(this);
			this.recurring = _cron;
		}
		if (data) this.data = data;
		if (typeof catchUp !== 'undefined') this.catchUp = catchUp;

		// Sync the database if some of the properties changed or the time changed manually
		// (recurring tasks bump the time automatically)
		const _index = this.store._tasks.findIndex(entry => entry.id === this.id);
		if (_index !== -1) await this.client.settings.update('schedules', this.toJSON(), { arrayPosition: _index });

		return this;
	}

	/**
	 * Delete the task
	 * @since 0.5.0
	 * @example
	 * ScheduledTask.delete()
	 *     .then(() => console.log('Successfully deleted the task'))
	 *     .catch(console.error);
	 */
	public delete(): Promise<Schedule> {
		return this.store.delete(this.id);
	}

	/**
	 * Override for JSON.stringify
	 * @since 0.5.0
	 * @returns {ScheduledTaskJSON}
	 */
	public toJSON() {
		return {
			id: this.id,
			taskName: this.taskName,
			time: this.time.getTime(),
			catchUp: this.catchUp,
			data: this.data,
			repeat: this.recurring ? this.recurring.cron : null
		};
	}

	/**
	 * Resolve the time and cron
	 * @since 0.5.0
	 * @param time The time or {@link Cron} pattern
	 */
	private static _resolveTime(time: TimeResolvable): [Date, Cron | null] {
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
	 * @param client The Discord client
	 */
	private static _generateID(client: KlasaClient): string {
		// todo: check if ws has a shards array exposed
		return `${Date.now().toString(36)}${client.options.ws.shards[0].toString(36)}`;
	}

	/**
	 * Validate a task
	 * @since 0.5.0
	 * @param st The task to validate
	 */
	private static _validate(st: ScheduledTask): void {
		if (!st.task) throw new Error('invalid task');
		if (!st.time) throw new Error('time or repeat option required');
		if (Number.isNaN(st.time.getTime())) throw new Error('invalid time passed');
	}

}
