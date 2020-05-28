import { TimerManager } from '@klasa/timer-manager';
import { ScheduledTask, ScheduledTaskOptions, ScheduledTaskJSON } from './ScheduledTask';

import type { Client } from '@klasa/core';

/**
 * <warning>Schedule is a singleton, use {@link KlasaClient#schedule} instead.</warning>
 * The Schedule class that manages all scheduled tasks
 */
export class Schedule {

	/**
	 * The Client instance that initialized this instance
	 * @since 0.5.0
	 */
	public client: Client;

	/**
	 * An array of all processed ScheduledTask instances
	 * @since 0.5.0
	 */
	public tasks: ScheduledTask[] = [];

	/**
	 * The current interval that runs the tasks
	 * @since 0.5.0
	 */
	#interval: NodeJS.Timer | null = null;

	constructor(client: Client) {
		this.client = client;
	}

	/**
	 * Get all the tasks from the cache
	 * @since 0.5.0
	 */
	protected get _tasks(): ScheduledTaskJSON[] {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		return this.client.settings!.get('schedules') as ScheduledTaskJSON[] ?? [];
	}

	/**
	 * Init the Schedule
	 * @since 0.5.0
	 */
	public async init(): Promise<void> {
		const tasks = this._tasks;
		if (!tasks || !Array.isArray(tasks)) return;

		for (const task of tasks) {
			try {
				await this._add(task.taskName, task.repeat || task.time, task);
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
	protected async execute(): Promise<void> {
		if (this.tasks.length) {
			// Process the active tasks, they're sorted by the time they end
			const now = Date.now();
			const execute = [];
			for (const task of this.tasks) {
				if (task.time.getTime() > now) break;
				execute.push(task.run());
			}

			// Check if the Schedule has a task to run and run them if they exist
			if (!execute.length) return;
			await Promise.all(execute);
		}
		this._checkInterval();
	}

	/**
	 * Returns the next ScheduledTask from the id
	 * @param {string} id The id of the ScheduledTask you want
	 * @returns {ScheduledTask}
	 */
	public get(id: string): ScheduledTask | undefined {
		return this.tasks.find(entry => entry.id === id);
	}

	/**
	 * Return the next ScheduledTask pending for execution
	 * @returns {ScheduledTask}
	 */
	public next(): ScheduledTask {
		return this.tasks[0];
	}

	/**
	 * Adds a new task to the database
	 * @since 0.5.0
	 * @param taskName The name of the task
	 * @param time The time or Cron pattern
	 * @param options The options for the ScheduleTask instance
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
	public async create(taskName: string, time: Date | number | string, options?: ScheduledTaskOptions): Promise<ScheduledTask | null> {
		const task = await this._add(taskName, time, options);
		if (!task) return null;
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		await this.client.settings!.update('schedules', task, { arrayAction: 'add' });
		return task;
	}

	/**
	 * Delete a Task by its ID
	 * @since 0.5.0
	 * @param id The ID to search for
	 */
	public async delete(id: string): Promise<this> {
		const taskIndex = this.tasks.findIndex(entry => entry.id === id);
		if (taskIndex === -1) throw new Error('This task does not exist.');

		this.tasks.splice(taskIndex, 1);
		// Get the task and use it to remove
		const task = this._tasks.find(entry => entry.id === id);
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		if (task) await this.client.settings!.update('schedules', task, { arrayAction: 'remove' });

		return this;
	}

	/**
	 * Clear all the ScheduledTasks
	 * @since 0.5.0
	 */
	public async clear(): Promise<void> {
		// this._tasks is unedited as Settings#clear will clear the array
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		await this.client.settings!.reset('schedules');
		this.tasks = [];
	}

	/**
	 * Adds a task to the cache
	 * @since 0.5.0
	 * @param {string} taskName The name of the task
	 * @param {(Date|number|string)} time The time or Cron pattern
	 * @param {ScheduledTaskOptions} [options={}] The options for the ScheduledTask instance
	 * @returns {?ScheduledTask}
	 * @private
	 */
	private async _add(taskName: string, time: Date | number | string, options?: ScheduledTaskOptions): Promise<ScheduledTask | null> {
		const task = new ScheduledTask(this.client, taskName, time, options);

		// If the task were due of time before the bot's initialization, delete if not recurring, else update for next period
		if (!task.catchUp && task.time.valueOf() < Date.now()) {
			if (!task.recurring) {
				await task.delete();
				return null;
			}
			await task.update({ time: task.recurring });
		}
		this._insert(task);
		this._checkInterval();
		return task;
	}

	/**
	 * Inserts the ScheduledTask instance in its sorted position for optimization
	 * @since 0.5.0
	 * @param task The ScheduledTask instance to insert
	 */
	protected _insert(task: ScheduledTask): ScheduledTask {
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
	private _clearInterval(): void {
		if (this.#interval) {
			TimerManager.clearInterval(this.#interval);
			this.#interval = null;
		}
	}

	/**
	 * Sets the interval when needed
	 * @since 0.5.0
	 * @private
	 */
	private _checkInterval(): void {
		if (!this.tasks.length) this._clearInterval();
		else if (!this.#interval) this.#interval = TimerManager.setInterval(this.execute.bind(this), this.client.options.schedule.interval);
	}

	/**
	 * Returns a new Iterator object that contains the values for each element contained in the task queue.
	 * @since 0.5.0
	 */
	public *[Symbol.iterator](): IterableIterator<ScheduledTask> {
		yield* this.tasks;
	}

}
