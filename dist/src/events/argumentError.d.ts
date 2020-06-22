import { Event, Message } from '@klasa/core';
import type { Argument } from 'klasa';
export default class extends Event {
    run(message: Message, argument: Argument, _params: readonly unknown[], error: Error | string): Promise<void>;
}
