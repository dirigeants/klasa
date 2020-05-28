import { Event, EventStore, Guild } from '@klasa/core';
export default class extends Event {
    constructor(store: EventStore, directory: string, file: readonly string[]);
    run(guild: Guild): Promise<void>;
}
