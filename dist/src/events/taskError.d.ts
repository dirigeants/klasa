import { Event } from '@klasa/core';
import type { Task, ScheduledTask } from 'klasa';
export default class extends Event {
    run(_scheduledTask: ScheduledTask, task: Task, error: Error): void;
}
