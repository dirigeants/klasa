const Base = require('./Base');

/**
 * @name Schema2
 * @extends Base
 * @since 0.5.0
 */
class Schema extends Base {

	// TODO: Not sure if Gateway is needed here, might just be able to remove it. The only thing keeping it here is TypeChecking From settingsResolver

	constructor() {
		super();

		/**
		 * The Gateway this Schema is for
		 * @since 0.5.0
		 * @type {?Gateway}
		 * @readonly
		 */
		Object.defineProperty(this, 'gateway', { value: null, writable: true });
	}

	/**
	 * Returns the path for this schema, which is just 'schema'
	 * @since 0.5.0
	 * @type {string}
	 * @readonly
	 */
	get path() {
		return 'schema';
	}

}

module.exports = Schema;
