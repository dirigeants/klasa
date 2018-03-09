/**
 * The schema class that stores (nested) folders and keys for SettingGateway usage. This class also implements multiple helpers.
 * @abstract
 */
class Schema {

	/**
	 * @since 0.5.0
	 * @param {KlasaClient} client The client which initialized this instance
	 * @param {Gateway} gateway The Gateway that manages this schema instance
	 * @param {Object} options The object containing the properties for this schema instance
	 * @param {?Schema} parent The parent which holds this instance
	 * @param {string} key The name of this key
	 */
	constructor(client, gateway, options, parent, key) {
		/**
		 * The Klasa client.
		 * @since 0.5.0
		 * @type {KlasaClient}
		 * @name Schema#client
		 * @readonly
		 */
		Object.defineProperty(this, 'client', { value: client });

		/**
		 * The Gateway that manages this schema instance.
		 * @since 0.5.0
		 * @type {Gateway}
		 * @name Schema#gateway
		 * @readonly
		 */
		Object.defineProperty(this, 'gateway', { value: gateway });

		/**
		 * The Schema instance that is parent of this instance.
		 * @since 0.5.0
		 * @type {?Schema}
		 * @name Schema#parent
		 * @readonly
		 */
		Object.defineProperty(this, 'parent', { value: parent });

		/**
		 * The path of this schema instance.
		 * @since 0.5.0
		 * @type {string}
		 * @name Schema#path
		 * @readonly
		 */
		Object.defineProperty(this, 'path', { value: `${parent && parent.path.length ? `${parent.path}.` : ''}${key}` });

		/**
		 * The name of this schema instance.
		 * @since 0.5.0
		 * @type {string}
		 * @name Schema#key
		 * @readonly
		 */
		Object.defineProperty(this, 'key', { value: key });

		/**
		 * Whether the schema instance is initialized or not.
		 * @since 0.5.0
		 * @type {boolean}
		 * @name Schema#_inited
		 * @private
		 */
		Object.defineProperty(this, '_inited', { value: false, writable: true });
	}

}

module.exports = Schema;
