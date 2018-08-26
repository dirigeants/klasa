class RateLimit {

	constructor(manager) {
		this.manager = manager;
		this.reset();
	}

	get limited() {
		return !(this.remaining > 0 || this.expired);
	}

	get expired() {
		return Date.now() >= this.resetTime;
	}

	reset() {
		this.remaining = this.manager.bucket;
		this.resetTime = Date.now() + this.manager.cooldown;
		return this;
	}

	drip() {
		if (this.limited) throw new Error('Ratelimited');
		if (this.expired) this.reset();

		this.remaining--;
		return this;
	}

	undrip() {
		this.count = Math.min(this.remaining + 1, this.manager.bucket);
		return this;
	}

}

module.exports = RateLimit;
