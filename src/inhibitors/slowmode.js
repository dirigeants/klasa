const { Inhibitor, RateLimitManager } = require('klasa');

module.exports = class extends Inhibitor {

	constructor(...args) {
		super(...args, { spamProtection: true });
		this.slowmode = new RateLimitManager(1, this.client.options.slowmode);
		this.aggressive = this.client.options.slowmodeAggressive;
	}

	async run(message) {
		if (message.author === this.client.owner) return;

		const slowmodeLevel = message.author.id;
		const rateLimit = this.slowmode.get(slowmodeLevel) || this.slowmode.create(slowmodeLevel);

		try {
			rateLimit.drip();
		} catch (err) {
			if (this.aggressive) rateLimit.resetTime = Date.now() + rateLimit.cooldown;
			throw true;
		}
	}

	init() {
		if (!this.client.options.slowmode) this.disable();
	}

};
