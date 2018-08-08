const SchemaPiece = require('./SchemaPiece');
const { isObject, isFunction, deepClone } = require('../../util/util');

/**
 * The base class for Schema and SchemaFolder
 * @since 0.5.0
 * @extends Map
 * @private
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
		const { defaultOptions = {} } = this;
		let Piece;

		if (isFunction(type)) {
			// add('key', (folder) => {});
			callback = type;
			type = 'Folder';
			Piece = require('./SchemaFolder');
		} else if (isObject(type)) {
			// add('key', { ...options });
			if (isFunction(options)) {
				// add('key', { ...options }, (folder) => {})
				callback = options;
				options = type;
				type = 'Folder';
				Piece = require('./SchemaFolder');
			} else {
				// add('key', { type, ...options });
				type = options.type || defaultOptions.type;
				Piece = SchemaPiece;
			}
		} else if (typeof type === 'string') {
			// add('key', 'type');
			Piece = type === 'Folder' ? require('./SchemaFolder') : SchemaPiece;
		} else if (!type && ('type' in defaultOptions)) {
			// add('key');
			({ type } = defaultOptions);
			Piece = SchemaPiece;
		}

		if (!type) {
			throw new Error(`The type for ${key} must be a string for pieces, and a callback for folders`);
		}

		const piece = new Piece(this, key, type, options);

		// eslint-disable-next-line callback-return
		if (callback) callback(piece);

		this.set(key, piece);
		return this;
	}

	remove(key) {
		return super.delete(key);
	}


	/**
	 * Debug the current SchemaFolder or Schema instance.
	 * @since 0.5.0
	 * @returns {Array<?string>}
	 * @private
	 */
	debug() {
		let errors = [];
		for (const piece of this.values()) {
			if (piece.type === 'Folder') {
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
			if (piece.type === 'Folder') keys = keys.concat(piece.configurableKeys);
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
	 * @type {Map<string, SchemaFolder|SchemaPiece>}
	 */
	get paths() {
		const paths = new Map();
		for (const piece of this.values()) {
			if (piece.type === 'Folder') for (const pie of piece.paths.values()) paths.set(pie.path, pie);
			else paths.set(piece.path, piece);
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
