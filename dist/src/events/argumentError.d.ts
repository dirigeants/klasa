import { Event, Message } from '@klasa/core';
import type { Argument } from 'klasa';
export default class extends Event {
    run(message: Message, _argument: Argument, _params: readonly unknown[], error: string): void;
}
