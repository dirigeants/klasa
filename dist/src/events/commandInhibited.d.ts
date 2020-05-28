import { Event, Message } from '@klasa/core';
import type { Command } from 'klasa';
export default class extends Event {
    run(message: Message, _command: Command, response: string): void;
}
