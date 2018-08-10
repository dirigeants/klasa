const Base = require('./Base');

/**
 * @extends Base
 * @since 0.5.0
 */
class Schema extends Base {

	constructor() {
		super();
		/**
		 * Returns the path for this schema
		 * @since 0.5.0
		 * @type {string}
		 * @private
		 * @readonly
		 */
		Object.defineProperty(this, 'path', { value: '' });
	}

}

module.exports = Schema;
