const { Collection } = require('discord.js');
const RateLimit = require('./RateLimit');

class RateLimitManager extends Collection {

	constructor(bucket, cooldown) {
		super();

		this.sweepInterval = null;

		this.bucket = bucket;

		this.cooldown = cooldown * 1000;
	}

	sweep(fn = rl => rl.expired, thisArg) {
		const amount = super.sweep(fn, thisArg);

		if (this.size === 0) {
			clearInterval(this.sweepInterval);
			this.sweepInterval = null;
		}

		return amount;
	}

	set(id, rateLimit) {
		if (rateLimit instanceof RateLimit) throw new TypeError('Invalid RateLimit');
		if (!this.sweepInterval) this.sweepInterval = setInterval(this.sweep.bind(this), 30000);
		return super.set(id, rateLimit);
	}

	create(id) {
		return this.set(id, new RateLimit(this));
	}

}

module.exports = RateLimitManager;
