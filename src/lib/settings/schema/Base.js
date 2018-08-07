const SchemaPiece = require('./SchemaPiece');
const { isObject, isFunction, deepClone } = require('../../util/util');

/**
 * @private
 * @since 0.5.0
 * @extends Map
 */
class Base extends Map {

	/**
	 * Adds a Folder or Piece instance to the current SchemaFolder or Schema instance
	 * @param {string} key The name of this new piece you are trying to add.
	 * @param {Function|Object|string} type A function, object, or string. See examples for usage.
	 * @param {Function|Object} [options={}] An object of options to pass to the folder or piece.
	 * @param {Function} [callback=null] A function to add more keys to a newly created SchemaFolder
	 * @since 0.5.0
	 * @returns {SchemaFolder|Schema}
	 * @example
	 * // Add a new SchemaFolder with no defaults
	 * Schema.add('folderKey', () => true);
	 *
	 * // Add a new SchemaFolder with defaults for added keys
	 * // All keys added to this SchemaFolder will inherit SchemaFolder options
	 * Schema.add('folderKey', { type: 'string', max: 100, min: 5 }, () => true);
	 *
	 * // If you want to add keys on the new SchemaFolder
   * Schema.add('folderKey', { type: 'string', max: 100, min: 5 }, (Folder) => {
	 *		Folder.add('stringKey1') // will inherit type from the Folder, along with min and max
	 *		      .add('stringKey2', { min: 50 }); // we want this key to have a different minimum, so we'll change it
	 *	});
	 *
	 * // If you want to add a key that doesn't have defaultOptions
	 * SchemaFolder.add('pieceKey', 'textchannel', {})
	 * // or
	 * Schema.add('pieceKey', 'textchannel', {});
	 */
	add(key, type, options = {}, callback = null) {
		if (this.has(key)) throw new Error(`The key ${key} already exists in the current schema.`);
		if (typeof this[key] !== 'undefined') throw new Error(`The key ${key} conflicts with a property of Schema.`);
		if (!type) {
			if (type in this.defaultOptions) ({ type } = this.defaultOptions);
			else throw new Error(`The key ${key} must have a type specified as it's first argument.`);
		}
		let Piece;

		if (isFunction(type)) {
			callback = type;
			type = 'folder';
			Piece = require('./SchemaFolder');
		} else if (isObject(type) && isFunction(options)) {
			callback = options;
			options = type;
			type = 'folder';
			Piece = require('./SchemaFolder');
		} else if (typeof type === 'string') {
			Piece = type.toLowerCase() === 'folder' ? require('./SchemaFolder') : SchemaPiece;
		} else {
			throw new Error(`The type for ${key} must be a string for pieces, and a callback for folders`);
		}

		const piece = new Piece(this, key, type, options);

		// eslint-disable-next-line callback-return
		if (callback) callback(piece);

		this.set(key, piece);
		return this;
	}

	/**
	 * Debug the current SchemaFolder or Schema instance.
	 * @since 0.5.0
	 * @returns {Array<?string>}
	 */
	debug() {
		let errors = [];
		for (const piece of this.values()) {
			if (piece.type === 'folder') {
				errors = errors.concat(piece.debug());
			} else {
				try {
					piece.isValid();
				} catch (error) {
					errors.push(error.message);
				}
			}
		}
		return errors;
	}

	/**
	 * Get the configurable keys for the current SchemaFolder or Schema instance
	 * @since 0.5.0
	 * @readonly
	 * @type {Array<string>}
	 */
	get configurableKeys() {
		let keys = [];
		for (const piece of this.values()) {
			if (piece.configurableKeys) keys = keys.concat(piece.configurableKeys);
			else keys.push(piece.key);
		}
		return keys;
	}

	/**
	 * Get the defaults for the current SchemaFolder or Schema instance
	 * @since 0.5.0
	 * @readonly
	 * @type {Object}
	 */
	get defaults() {
		return Object.assign({}, ...[...this.values()].map(piece => ({ [piece.key]: piece.defaults || deepClone(piece.default) })));
	}

	/**
	 * Get the paths for the current SchemaFolder or Schema instance
	 * @since 0.5.0
	 * @readonly
	 * @type {Array<string>}
	 */
	get paths() {
		let paths = [];
		for (const piece of this.values()) {
			if (piece.paths) paths = [...paths, ...piece.paths];
			else paths.push(piece.path);
		}
		return paths;
	}

	/**
	 * Get a JSON object containing data from this SchemaFolder
	 * @since 0.5.0
	 * @returns {Object}
	 */
	toJSON() {
		return Object.assign({}, ...[...this.values()].map(piece => ({ [piece.key]: piece.toJSON() })));
	}


}

module.exports = Base;
