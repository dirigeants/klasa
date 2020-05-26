import { Event } from '@klasa/core';
import type { Command, KlasaMessage } from 'klasa';
export default class extends Event {
    run(message: KlasaMessage, _command: Command, response: string): void;
}
