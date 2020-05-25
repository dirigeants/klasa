import { Finalizer, KlasaMessage, Command } from 'klasa';
import { RateLimitManager, RateLimit } from '@klasa/ratelimits';

export default class extends Finalizer {

	public cooldowns = new WeakMap();

	public run(message: KlasaMessage, command: Command): void {
		if (command.cooldown <= 0 || this.client.owners.has(message.author)) return;

		try {
			this.getCooldown(message, command).drip();
		} catch (err) {
			this.client.emit('error', `${message.author.username}[${message.author.id}] has exceeded the RateLimit for ${message.command}`);
		}
	}

	public getCooldown(message: KlasaMessage, command: Command): RateLimit {
		let cooldownManager = this.cooldowns.get(command);
		if (!cooldownManager) {
			cooldownManager = new RateLimitManager(command.bucket, command.cooldown * 1000);
			this.cooldowns.set(command, cooldownManager);
		}
		return cooldownManager.acquire(message.guild ? Reflect.get(message, command.cooldownLevel).id : message.author.id);
	}

}
