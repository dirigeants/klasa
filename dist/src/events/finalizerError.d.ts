import { Event } from '@klasa/core';
import type { KlasaMessage, Command, Finalizer } from 'klasa';
import type { Stopwatch } from '@klasa/stopwatch';
export default class extends Event {
    run(_message: KlasaMessage, _command: Command, _response: KlasaMessage[], _timer: Stopwatch, finalizer: Finalizer, error: Error): void;
}
