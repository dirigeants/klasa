import { ScheduledTask, ScheduledTaskOptions, ScheduledTaskJSON } from './ScheduledTask';
import type { Client } from '@klasa/core';
/**
 * <warning>Schedule is a singleton, use {@link KlasaClient#schedule} instead.</warning>
 * The Schedule class that manages all scheduled tasks
 */
export declare class Schedule {
    #private;
    /**
     * The Client instance that initialized this instance
     * @since 0.5.0
     */
    client: Client;
    /**
     * An array of all processed ScheduledTask instances
     * @since 0.5.0
     */
    tasks: ScheduledTask[];
    constructor(client: Client);
    /**
     * Get all the tasks from the cache
     * @since 0.5.0
     */
    protected get _tasks(): ScheduledTaskJSON[];
    /**
     * Init the Schedule
     * @since 0.5.0
     */
    init(): Promise<void>;
    /**
     * Execute the current tasks
     * @since 0.5.0
     */
    protected execute(): Promise<void>;
    /**
     * Returns the next ScheduledTask from the id
     * @param {string} id The id of the ScheduledTask you want
     * @returns {ScheduledTask}
     */
    get(id: string): ScheduledTask | undefined;
    /**
     * Return the next ScheduledTask pending for execution
     * @returns {ScheduledTask}
     */
    next(): ScheduledTask;
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
    create(taskName: string, time: Date | number | string, options?: ScheduledTaskOptions): Promise<ScheduledTask | null>;
    /**
     * Delete a Task by its ID
     * @since 0.5.0
     * @param id The ID to search for
     */
    delete(id: string): Promise<this>;
    /**
     * Clear all the ScheduledTasks
     * @since 0.5.0
     */
    clear(): Promise<void>;
    /**
     * Adds a task to the cache
     * @since 0.5.0
     * @param {string} taskName The name of the task
     * @param {(Date|number|string)} time The time or Cron pattern
     * @param {ScheduledTaskOptions} [options={}] The options for the ScheduledTask instance
     * @returns {?ScheduledTask}
     * @private
     */
    private _add;
    /**
     * Inserts the ScheduledTask instance in its sorted position for optimization
     * @since 0.5.0
     * @param task The ScheduledTask instance to insert
     */
    protected _insert(task: ScheduledTask): ScheduledTask;
    /**
     * Clear the current interval
     * @since 0.5.0
     * @private
     */
    private _clearInterval;
    /**
     * Sets the interval when needed
     * @since 0.5.0
     * @private
     */
    private _checkInterval;
    /**
     * Returns a new Iterator object that contains the values for each element contained in the task queue.
     * @since 0.5.0
     */
    [Symbol.iterator](): IterableIterator<ScheduledTask>;
}
