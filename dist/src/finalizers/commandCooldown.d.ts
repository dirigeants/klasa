import { Finalizer, Command } from 'klasa';
import { RateLimit } from '@klasa/ratelimits';
import type { Message } from '@klasa/core';
export default class extends Finalizer {
    cooldowns: WeakMap<object, any>;
    run(message: Message, command: Command): void;
    getCooldown(message: Message, command: Command): RateLimit;
}
