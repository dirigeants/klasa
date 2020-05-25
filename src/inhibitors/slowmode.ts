import { Inhibitor, KlasaMessage, InhibitorStore } from 'klasa';
import { RateLimitManager } from '@klasa/ratelimits';

export default class extends Inhibitor {

	private readonly slowmode: RateLimitManager;
	private readonly aggressive: boolean;

	constructor(store: InhibitorStore, directory: string, files: readonly string[]) {
		super(store, directory, files, { spamProtection: true });
		this.slowmode = new RateLimitManager(1, this.client.options.commands.slowmode);
		this.aggressive = this.client.options.commands.slowmodeAggressive;

		if (!this.client.options.commands.slowmode) this.disable();
	}

	public run(message: KlasaMessage): void {
		if (this.client.owners.has(message.author)) return;

		const rateLimit = this.slowmode.acquire(message.author.id);

		try {
			rateLimit.drip();
		} catch (err) {
			if (this.aggressive) rateLimit.resetTime();
			throw true;
		}
	}

}
