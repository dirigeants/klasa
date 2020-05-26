import { Event } from '@klasa/core';
import type { Argument, KlasaMessage } from 'klasa';
export default class extends Event {
    run(message: KlasaMessage, argument: Argument, _params: readonly unknown[], error: Error): void;
}
