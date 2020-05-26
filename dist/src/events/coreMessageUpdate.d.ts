import { Event, EventStore } from '@klasa/core';
import type { KlasaMessage } from 'klasa';
export default class extends Event {
    constructor(store: EventStore, directory: string, file: readonly string[]);
    run(message: KlasaMessage, previous: KlasaMessage): void;
}
