import { Event } from '@klasa/core';
import type { KlasaMessage, Monitor } from 'klasa';
export default class extends Event {
    run(_message: KlasaMessage, monitor: Monitor, error: Error): void;
}
