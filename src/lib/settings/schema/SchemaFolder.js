const Base = require('./Base');


/**
 * Creates our SchemaFolder instance
 * @extends Base
 * @param {SchemaFolder|Schema} parent The parent folder or schema for this folder instance
 * @param {string} key The name of this folder instance
 * @param {string} type The type for this folder instance (always 'folder')
 * @param {Object} [options={}] The options for this folder instance
 * @since 0.5.0
 */
class SchemaFolder extends Base {

	constructor(parent, key, type, options = {}) {
		super();
		/**
		 * The parent of this SchemaFolder
		 * @since 0.5.0
		 * @type {Schema|SchemaFolder}
		 * @readonly
		 */
		Object.defineProperty(this, 'parent', { value: parent });

		/**
		 * The name of this SchemaFolder
		 * @since 0.5.0
		 * @type {string}
		 * @readonly
		 */
		Object.defineProperty(this, 'key', { value: key });

		// TODO: Maybe remove this type property??? I don't think it's really needed.. other then for like backwards comp.

		/**
		 * The type of this SchemaFolder (always 'folder')
		 * @since 0.5.0
		 * @type {string}
		 * @readonly
		 */
		Object.defineProperty(this, 'type', { value: type.toLowerCase() });

		/**
		 * The path of this SchemaFolder
		 * @since 0.5.0
		 * @type {string}
		 * @readonly
		 */
		Object.defineProperty(this, 'path', { value: `${this.parent.path}.${this.key}` });


		/**
		 * The default options that every key that is added to this folder will inherit.
		 * @since 0.5.0
		 * @type {Object}
		 * @readonly
		 */
		Object.defineProperty(this, 'defaultOptions', { value: options });
	}

}

module.exports = SchemaFolder;
