const { Inhibitor, RateLimitManager } = require('klasa');

module.exports = class extends Inhibitor {

	constructor(...args) {
		super(...args, { spamProtection: true });
		this.slowmode = new RateLimitManager(1, this.client.options.slowmode);
		this.aggressive = this.client.options.slowmodeAggressive;

		if (!this.client.options.slowmode) this.disable();
	}

	run(message) {
		if (message.author === this.client.owner) return;

		const rateLimit = this.slowmode.acquire(message.author.id);

		try {
			rateLimit.drip();
		} catch (err) {
			if (this.aggressive) rateLimit.resetTime();
			throw true;
		}
	}

};
