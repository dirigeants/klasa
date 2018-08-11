const Base = require('./Base');

/**
 * The base Schema for {@link Gateway}s
 * @extends Base
 * @since 0.5.0
 */
class Schema extends Base {

	/**
	 * @param {string} [basePath=''] The base schema path
	 */
	constructor(basePath = '') {
		super();

		/**
		 * Returns the path for this schema
		 * @since 0.5.0
		 * @name Schema#path
		 * @type {string}
		 * @readonly
		 */
		Object.defineProperty(this, 'path', { value: basePath });
	}

}

module.exports = Schema;
