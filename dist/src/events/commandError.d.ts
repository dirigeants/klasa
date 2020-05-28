import { Event, Message } from '@klasa/core';
import type { Command } from 'klasa';
export default class extends Event {
    run(message: Message, command: Command, _params: readonly unknown[], error: Error | string): void;
}
