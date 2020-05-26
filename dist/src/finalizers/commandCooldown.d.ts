import { Finalizer, KlasaMessage, Command } from 'klasa';
import { RateLimit } from '@klasa/ratelimits';
export default class extends Finalizer {
    cooldowns: WeakMap<object, any>;
    run(message: KlasaMessage, command: Command): void;
    getCooldown(message: KlasaMessage, command: Command): RateLimit;
}
