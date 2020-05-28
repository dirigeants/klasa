import { Event, EventStore, Message } from '@klasa/core';
export default class extends Event {
    constructor(store: EventStore, directory: string, file: readonly string[]);
    run(message: Message): Promise<void>;
}
