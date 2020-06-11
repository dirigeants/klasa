import { isObject } from '@klasa/utils';
import { Cron } from '@klasa/cron';
import { isSet, Client } from '@klasa/core';

import type { Schedule } from './Schedule';
import type { Task } from '../structures/Task';

/**
 * The structure for future tasks to be run
 */
export class ScheduledTask {

	/**
	 * The Client instance that initialized this instance
	 * @since 0.5.0
	 */
	public client: Client;

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
	public data: Record<PropertyKey, unknown>;

	/**
	 * If the ScheduledTask is being run currently
	 * @since 0.5.0
	 */
	#running = false;

	/**
	 * Initializes a new ScheduledTask
	 * @since 0.5.0
	 * @param client The client that initialized this instance
	 * @param taskName The name of the task this ScheduledTask is for
	 * @param time The time or {@link Cron} pattern
	 * @param options The options for this ScheduledTask instance
	 */
	public constructor(client: Client, taskName: string, time: TimeResolvable, options: ScheduledTaskUpdateOptions = {}) {
		const [_time, _recurring] = (this.constructor as typeof ScheduledTask)._resolveTime(time);

		this.client = client;
		this.taskName = taskName;
		this.recurring = _recurring;
		this.time = _time;
		this.id = options.id || (this.constructor as typeof ScheduledTask)._generateID(this.client);
		this.catchUp = isSet(options, 'catchUp') ? options.catchUp : true;
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
			await task.run({ ...this.data ?? {}, id: this.id });
		} catch (err) {
			this.client.emit('taskError', this, task, err);
		}
		this.#running = false;

		if (this.recurring) return this.update({ time: this.recurring });
		await this.delete();
		return this;
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
	public async update({ time, data, catchUp }: ScheduledTaskUpdateOptions = {}): Promise<this> {
		if (time) {
			const [_time, _cron] = (this.constructor as typeof ScheduledTask)._resolveTime(time);
			this.time = _time;
			this.store.tasks.splice(this.store.tasks.indexOf(this), 1);
			// eslint-disable-next-line dot-notation
			this.store['_insert'](this);
			this.recurring = _cron;
		}
		if (data) this.data = data;
		if (typeof catchUp !== 'undefined') this.catchUp = catchUp;

		// Sync the database if some of the properties changed or the time changed manually
		// (recurring tasks bump the time automatically)
		// eslint-disable-next-line dot-notation
		const arrayIndex = this.store['_tasks'].findIndex(entry => entry.id === this.id);
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		if (arrayIndex !== -1) await this.client.settings!.update('schedules', this.toJSON(), { arrayIndex });

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
	 */
	public toJSON(): ScheduledTaskJSON {
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
	private static _generateID(client: Client): string {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		return `${Date.now().toString(36)}${client.ws.shards.firstValue!.id.toString(36)}`;
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

export type TimeResolvable = Date | number | Cron | string;

export interface ScheduledTaskOptions {
	/**
	 * The ID for the task. By default, it generates one in base36.
	 * @since 0.5.0
	 */
	id?: string;

	/**
	 * If the task should try to catch up if the bot is down.
	 * @since 0.5.0
	 */
	catchUp?: boolean;

	/**
	 * The data to pass to the Task piece when the ScheduledTask is ready for execution.
	 * @since 0.5.0
	 */
	data?: Record<PropertyKey, unknown>;
}

export interface ScheduledTaskUpdateOptions extends ScheduledTaskOptions {
	/**
	 * The time or {@link Cron} pattern.
	 * @since 0.5.0
	 */
	time?: TimeResolvable;
}

export interface ScheduledTaskJSON {
	/**
	 * The task's ID.
	 * @since 0.5.0
	 */
	id: string;

	/**
	 * The name of the Task piece this will execute.
	 * @since 0.5.0
	 */
	taskName: string;

	/**
	 * The UNIX timestamp for when this task ends at.
	 * @since 0.5.0
	 */
	time: number;

	/**
	 * If the task should try to catch up if the bot is down.
	 * @since 0.5.0
	 */
	catchUp: boolean;

	/**
	 * The {@link Cron} pattern.
	 * @since 0.5.0
	 */
	repeat: string | null;

	/**
	 * The data to pass to the Task piece when the ScheduledTask is ready for execution.
	 * @since 0.5.0
	 */
	data: Record<PropertyKey, unknown>;

}
