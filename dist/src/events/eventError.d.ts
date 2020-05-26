import { Event } from '@klasa/core';
export default class extends Event {
    run(event: Event, _args: readonly unknown[], error: Error): void;
}
