import { Event, EventStore } from '@klasa/core';
export default class extends Event {
    constructor(store: EventStore, directory: string, file: readonly string[]);
    run(error: Error): void;
}
