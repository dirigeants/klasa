/**
 * Handels generic ratelimits such as for {@link Command#cooldown}s
 */
class RateLimit {

	/**
	 * @since 0.5.0
	 * @param {RateLimitManager} manager The RateLimitManager for this Ratelimit
	 */
	constructor(manager) {
		/**
		 * The RateLimitManager for this Ratelimit
		 * @since 0.5.0
		 * @type {RateLimitManager}
		 */
		this.manager = manager;

		this.reset();
	}

	/**
	 * If this RateLimit is expired or not, allowing the bucket to be reset
	 * @since 0.5.0
	 * @type {boolean}
	 * @readonly
	 */
	get expired() {
		return Date.now() >= this.resetTime;
	}

	/**
	 * If this RateLimit is limited or not
	 * @since 0.5.0
	 * @type {boolean}
	 * @readonly
	 */
	get limited() {
		return !(this.remaining > 0 || this.expired);
	}

	/**
	 * The remaining time before the RateLimit is reset
	 * @since 0.5.0
	 * @type {number}
	 * @readonly
	 */
	get remainingTime() {
		return this.resetTime - Date.now();
	}

	/**
	 * Drips the RateLimit bucket
	 * @since 0.5.0
	 * @returns {this}
	 */
	drip() {
		if (this.limited) throw new Error('Ratelimited');
		if (this.expired) this.reset();

		this.remaining--;
		return this;
	}

	/**
	 * Resets the RateLimit back to it's full state
	 * @since 0.5.0
	 * @returns {this}
	 */
	reset() {
		/**
		 * The remaining times this RateLimit can be dripped before the RateLimit bucket is empty
		 * @since 0.5.0
		 * @type {number}
		 * @private
		 */
		this.remaining = this.manager.bucket;

		/**
		 * When this RateLimit is reset back to a full state
		 * @since 0.5.0
		 * @type {number}
		 * @private
		 */
		this.resetTime = Date.now() + this.manager.cooldown;

		return this;
	}

}

module.exports = RateLimit;
