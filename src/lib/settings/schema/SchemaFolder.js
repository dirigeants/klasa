const Schema = require('./Schema');

/**
 * A Folder for organizing {@link SchemaPieces}
 * @extends Schema
 * @since 0.5.0
 */
class SchemaFolder extends Schema {

	/**
	 * @param {SchemaFolder|Schema} parent The parent folder or schema for this folder instance
	 * @param {string} key The name of this folder instance
	 */
	constructor(parent, key) {
		super(`${parent.path ? `${parent.path}.` : ''}${key}`);

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
	}

}

module.exports = SchemaFolder;
