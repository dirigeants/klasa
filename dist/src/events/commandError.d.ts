import { Event } from '@klasa/core';
import type { KlasaMessage, Command } from 'klasa';
export default class extends Event {
    run(message: KlasaMessage, command: Command, _params: readonly unknown[], error: Error | string): void;
}
