import { Finalizer, Command } from 'klasa';
import type { Message } from '@klasa/core';
import type { Stopwatch } from '@klasa/stopwatch';
export default class extends Finalizer {
    private reprompted;
    private user;
    private shard;
    private dm;
    private text;
    run(message: Message, command: Command, _response: Message[], timer: Stopwatch): void;
    init(): void;
}
