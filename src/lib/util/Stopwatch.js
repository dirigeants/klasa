const { performance } = require('perf_hooks');

/**
 * Klasa's Stopwatch class, uses native node to replicate/extend previous performance now dependancy.
 */
class Stopwatch {

	/**
	 * Starts a new Stopwatch
	 * @since 0.4.0
	 * @param {number} [digits = 2] The number of digits to appear after the decimal point when returning the friendly duration
	 */
	constructor(digits = 2) {
		/**
		 * The start time of this stopwatch
		 * @since 0.4.0
		 * @type {number}
		 */
		this.start = performance.now();

		/**
		 * The end time of this stopwatch
		 * @since 0.4.0
		 * @type {?number}
		 */
		this.end = null;

		/**
		 * The number of digits to appear after the decimal point when returning the friendly duration.
		 * @since 0.4.0
		 * @type {number}
		 */
		this.digits = digits;
	}

	/**
	 * The duration of this stopwatch since start or start to end if this stopwatch has stopped.
	 * @since 0.4.0
	 * @readonly
	 * @type {number}
	 */
	get duration() {
		return this.end ? this.end - this.start : performance.now() - this.start;
	}

	/**
	 * The duration formatted in a friendly string
	 * @since 0.4.0
	 * @readonly
	 * @type {string}
	 */
	get friendlyDuration() {
		const time = this.duration;
		if (time >= 1000) return `${(time / 1000).toFixed(this.digits)}s`;
		if (time >= 1) return `${time.toFixed(this.digits)}ms`;
		return `${(time * 1000).toFixed(this.digits)}μs`;
	}

	/**
	 * Stops the Stopwatch, freezing the duration
	 * @since 0.4.0
	 * @returns {Stopwatch}
	 */
	stop() {
		if (!this.end) this.end = performance.now();
		return this;
	}

	/**
	 * Defines toString behavior o return the friendlyDuration
	 * @since 0.4.0
	 * @returns {string}
	 */
	toString() {
		return this.friendlyDuration;
	}

}

module.exports = Stopwatch;
