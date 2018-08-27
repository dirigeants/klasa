const { Collection } = require('discord.js');
const RateLimit = require('./RateLimit');

/**
 * Manages {@link RateLimit}s
 * @extends {external:Collection}
 */
class RateLimitManager extends Collection {

	/**
	 * @since 0.5.0
	 * @param {number} bucket The amount of times a RateLimit can drip before it's limited
	 * @param {number} cooldown The amount of time in seconds for the RateLimit to reset
	 */
	constructor(bucket, cooldown) {
		super();

		/**
		 * The sweep interval for this RateLimitManager
		 * @since 0.5.0
		 * @type {?NodeJS.Timer}
		 * @private
		 */
		this.sweepInterval = null;

		/**
		 * The amount of times a RateLimit from this manager can drip before it's limited
		 * @since 0.5.0
		 * @type {number}
		 */
		this.bucket = bucket;

		/**
		 * The amount of time in ms for a RateLimit from this manager to reset
		 * @since 0.5.0
		 * @type {number}
		 */
		this.cooldown = cooldown;
	}

	/**
	 * Creates a {@link RateLimit} for this manager
	 * @since 0.5.0
	 * @param {string} id The id the RateLimit belongs to
	 * @returns {RateLimit}
	 */
	create(id) {
		const rateLimit = new RateLimit(this);
		this.set(id, rateLimit);
		return rateLimit;
	}

	/**
	 * Wraps {@link external:Collection}'s set method to set interval to sweep inactive RateLimits
	 * @since 0.5.0
	 * @param {string} id The id the RateLimit belongs to
	 * @param {RateLimit} rateLimit The this for the sweep
	 * @returns {number}
	 * @private
	 */
	set(id, rateLimit) {
		if (!(rateLimit instanceof RateLimit)) throw new TypeError('Invalid RateLimit');
		if (!this.sweepInterval) this.sweepInterval = setInterval(this.sweep.bind(this), 30000);
		return super.set(id, rateLimit);
	}

	/**
	 * Wraps {@link external:Collection}'s sweep method to clear the interval when this manager is empty
	 * @since 0.5.0
	 * @param {Function} fn The filter function
	 * @param {any} thisArg The this for the sweep
	 * @returns {number}
	 * @private
	 */
	sweep(fn = rl => rl.expired, thisArg) {
		const amount = super.sweep(fn, thisArg);

		if (this.size === 0) {
			clearInterval(this.sweepInterval);
			this.sweepInterval = null;
		}

		return amount;
	}

}

module.exports = RateLimitManager;
