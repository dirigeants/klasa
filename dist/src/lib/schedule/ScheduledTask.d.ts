import { Cron } from '@klasa/cron';
import { Client } from '@klasa/core';
import type { Schedule } from './Schedule';
import type { Task } from '../structures/Task';
/**
 * The structure for future tasks to be run
 */
export declare class ScheduledTask {
    #private;
    /**
     * The Client instance that initialized this instance
     * @since 0.5.0
     */
    client: Client;
    /**
     * The name of the Task this scheduled task will run
     * @since 0.5.0
     */
    taskName: string;
    /**
     * Whether this scheduled task is scheduled with the {@link Cron} pattern
     * @since 0.5.0
     */
    recurring: Cron | null;
    /**
     * The Date when this scheduled task ends
     * @since 0.5.0
     */
    time: Date;
    /**
     * The id for this scheduled task
     * @since 0.5.0
     */
    id: string;
    /**
     * If the task should catch up in the event the bot is down
     * @since 0.5.0
     * @type {boolean}
     */
    catchUp: boolean;
    /**
     * The stored metadata to send to the Task
     * @since 0.5.0
     */
    data: Record<PropertyKey, unknown>;
    /**
     * Initializes a new ScheduledTask
     * @since 0.5.0
     * @param client The client that initialized this instance
     * @param taskName The name of the task this ScheduledTask is for
     * @param time The time or {@link Cron} pattern
     * @param options The options for this ScheduledTask instance
     */
    constructor(client: Client, taskName: string, time: TimeResolvable, options?: ScheduledTaskUpdateOptions);
    /**
     * The Schedule class that manages all scheduled tasks
     * @since 0.5.0
     */
    get store(): Schedule;
    /**
     * The Task instance this scheduled task will run
     * @since 0.5.0
     */
    get task(): Task | null;
    /**
     * Run the current task and bump it if needed
     * @since 0.5.0
     */
    run(): Promise<this>;
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
    update({ time, data, catchUp }?: ScheduledTaskUpdateOptions): Promise<this>;
    /**
     * Delete the task
     * @since 0.5.0
     * @example
     * ScheduledTask.delete()
     *     .then(() => console.log('Successfully deleted the task'))
     *     .catch(console.error);
     */
    delete(): Promise<Schedule>;
    /**
     * Override for JSON.stringify
     * @since 0.5.0
     */
    toJSON(): ScheduledTaskJSON;
    /**
     * Resolve the time and cron
     * @since 0.5.0
     * @param time The time or {@link Cron} pattern
     */
    private static _resolveTime;
    /**
     * Generate a new ID based on timestamp and shard
     * @since 0.5.0
     * @param client The Discord client
     */
    private static _generateID;
    /**
     * Validate a task
     * @since 0.5.0
     * @param st The task to validate
     */
    private static _validate;
}
export declare type TimeResolvable = Date | number | Cron | string;
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
