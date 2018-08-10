const Base = require('./Base');

class SchemaFolder extends Base {

	/**
	 * Creates our SchemaFolder instance
	 * @extends Base
	 * @param {SchemaFolder|Schema} parent The parent folder or schema for this folder instance
	 * @param {string} key The name of this folder instance
	 * @param {string} type The type for this folder instance (always 'Folder')
	 * @since 0.5.0
	 */
	constructor(parent, key) {
		super();
		/**
		 * The parent of this SchemaFolder
		 * @since 0.5.0
		 * @name SchemaFolder#parent
		 * @type {Schema|SchemaFolder}
		 * @readonly
		 */
		Object.defineProperty(this, 'parent', { value: parent });

		/**
		 * The name of this SchemaFolder
		 * @since 0.5.0
		 * @name SchemaFolder#key
		 * @type {string}
		 * @readonly
		 */
		Object.defineProperty(this, 'key', { value: key });

		/**
		 * The type of this SchemaFolder (always 'Folder')
		 * @since 0.5.0
		 * @name SchemaFolder#type
		 * @type {string}
		 * @readonly
		 */
		Object.defineProperty(this, 'type', { value: 'Folder' });

		/**
		 * The path of this SchemaFolder
		 * @name SchemaFolder#path
		 * @since 0.5.0
		 * @type {string}
		 * @readonly
		 */
		Object.defineProperty(this, 'path', { value: `${this.parent.path ? `${this.parent.path}.` : ''}${this.key}` });
	}

}

module.exports = SchemaFolder;
