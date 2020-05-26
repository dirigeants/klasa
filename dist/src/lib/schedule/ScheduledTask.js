"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var _running;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduledTask = void 0;
const utils_1 = require("@klasa/utils");
const cron_1 = require("@klasa/cron");
const core_1 = require("@klasa/core");
/**
 * The structure for future tasks to be run
 */
class ScheduledTask {
    /**
     * Initializes a new ScheduledTask
     * @since 0.5.0
     * @param {KlasaClient} client The client that initialized this instance
     * @param {string} taskName The name of the task this ScheduledTask is for
     * @param {TimeResolvable} time The time or {@link Cron} pattern
     * @param {ScheduledTaskOptions} [options={}] The options for this ScheduledTask instance
     */
    constructor(client, taskName, time, options = {}) {
        /**
         * If the ScheduledTask is being run currently
         * @since 0.5.0
         */
        _running.set(this, false);
        const [_time, _recurring] = this.constructor._resolveTime(time);
        this.client = client;
        this.taskName = taskName;
        this.recurring = _recurring;
        this.time = _time;
        this.id = options.id || this.constructor._generateID(this.client);
        this.catchUp = core_1.isSet(options, 'catchUp') ? options.catchUp : true;
        this.data = 'data' in options && utils_1.isObject(options.data) ? options.data : {};
        this.constructor._validate(this);
    }
    /**
     * The Schedule class that manages all scheduled tasks
     * @since 0.5.0
     */
    get store() {
        return this.client.schedule;
    }
    /**
     * The Task instance this scheduled task will run
     * @since 0.5.0
     */
    get task() {
        var _a;
        return (_a = this.client.tasks.get(this.taskName)) !== null && _a !== void 0 ? _a : null;
    }
    /**
     * Run the current task and bump it if needed
     * @since 0.5.0
     */
    async run() {
        var _a;
        const { task } = this;
        if (!task || !task.enabled || __classPrivateFieldGet(this, _running))
            return this;
        __classPrivateFieldSet(this, _running, true);
        try {
            await task.run({ ...(_a = this.data) !== null && _a !== void 0 ? _a : {}, id: this.id });
        }
        catch (err) {
            this.client.emit('taskError', this, task, err);
        }
        __classPrivateFieldSet(this, _running, false);
        if (this.recurring)
            return this.update({ time: this.recurring });
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
    async update({ time, data, catchUp } = {}) {
        if (time) {
            const [_time, _cron] = this.constructor._resolveTime(time);
            this.time = _time;
            this.store.tasks.splice(this.store.tasks.indexOf(this), 1);
            // eslint-disable-next-line dot-notation
            this.store['_insert'](this);
            this.recurring = _cron;
        }
        if (data)
            this.data = data;
        if (typeof catchUp !== 'undefined')
            this.catchUp = catchUp;
        // Sync the database if some of the properties changed or the time changed manually
        // (recurring tasks bump the time automatically)
        // eslint-disable-next-line dot-notation
        const arrayIndex = this.store['_tasks'].findIndex(entry => entry.id === this.id);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        if (arrayIndex !== -1)
            await this.client.settings.update('schedules', this.toJSON(), { arrayIndex });
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
    delete() {
        return this.store.delete(this.id);
    }
    /**
     * Override for JSON.stringify
     * @since 0.5.0
     */
    toJSON() {
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
    static _resolveTime(time) {
        if (time instanceof Date)
            return [time, null];
        if (time instanceof cron_1.Cron)
            return [time.next(), time];
        if (typeof time === 'number')
            return [new Date(time), null];
        if (typeof time === 'string') {
            const cron = new cron_1.Cron(time);
            return [cron.next(), cron];
        }
        throw new Error('invalid time passed');
    }
    /**
     * Generate a new ID based on timestamp and shard
     * @since 0.5.0
     * @param client The Discord client
     */
    static _generateID(client) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return `${Date.now().toString(36)}${client.ws.shards.firstValue.id.toString(36)}`;
    }
    /**
     * Validate a task
     * @since 0.5.0
     * @param st The task to validate
     */
    static _validate(st) {
        if (!st.task)
            throw new Error('invalid task');
        if (!st.time)
            throw new Error('time or repeat option required');
        if (Number.isNaN(st.time.getTime()))
            throw new Error('invalid time passed');
    }
}
exports.ScheduledTask = ScheduledTask;
_running = new WeakMap();
//# sourceMappingURL=ScheduledTask.js.map