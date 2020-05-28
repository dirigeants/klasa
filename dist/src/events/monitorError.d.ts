import { Event, Message } from '@klasa/core';
import type { Monitor } from 'klasa';
export default class extends Event {
    run(_message: Message, monitor: Monitor, error: Error): void;
}
