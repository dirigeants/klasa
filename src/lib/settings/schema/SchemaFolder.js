const Base = require('./Base');


/**
 * Creates our SchemaFolder instance
 * @extends Base
 * @param {SchemaFolder|Schema} parent The parent folder or schema for this folder instance
 * @param {string} key The name of this folder instance
 * @param {string} type The type for this folder instance (always 'Folder')
 * @since 0.5.0
 */
class SchemaFolder extends Base {

	constructor(parent, key, type) {
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

		/**
		 * The type of this SchemaFolder (always 'Folder')
		 * @since 0.5.0
		 * @type {string}
		 * @readonly
		 */
		Object.defineProperty(this, 'type', { value: 'Folder' });

		/**
		 * The path of this SchemaFolder
		 * @since 0.5.0
		 * @type {string}
		 * @readonly
		 */
		Object.defineProperty(this, 'path', { value: `${this.parent.path ? `${this.parent.path}.` : ''}${this.key}` });
	}

}

module.exports = SchemaFolder;
