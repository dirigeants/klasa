const Piece = require('./base/Piece');

class Dataset extends Piece {

	/**
	 * @typedef {PieceOptions} DatasetOptions
	 * @property {boolean} [default=null] The default value for the dataset
	 */

	/**
	 * @since 0.5.0
	 * @param {KlasaClient} client The Klasa client
	 * @param {DatasetStore} store The Dataset Store
	 * @param {string} file The path from the pieces folder to the dataset file
	 * @param {string} directory The base directory to the pieces folder
	 * @param {DatasetOptions} [options={}] Optional Dataset settings
	 */
	constructor(client, store, file, directory, options = {}) {
		super(client, store, file, directory, options);

		/**
		 * The default value for this Dataset
		 */
		this.default = 'default' in options ? options.default : null;
	}

	/**
	 * Set a value
	 * @since 0.5.0
	 * @name Dataset#set
	 * @param {*} value The value to set
	 * @returns {*}
	 * @abstract
	 */

	/**
	 * Add a value
	 * @since 0.5.0
	 * @name Dataset#add
	 * @param {*} previous The previous value
	 * @param {*} value The new value to set
	 * @returns {*}
	 * @abstract
	 */

	/**
	 * Remove the value
	 * @since 0.5.0
	 * @name Dataset#remove
	 * @param {*} previous The previous value
	 * @param {*} value The new value to set
	 * @returns {*}
	 * @abstract
	 */

	/**
	 * Resolve a value
	 * @since 0.5.0
	 * @param {*} value The value to resolve
	 * @returns {Promise<*>}
	 */
	async deserialize(value) {
		return value;
	}

	/**
	 * Serialize a value
	 * @since 0.5.0
	 * @param {*} value The value to serialize
	 * @returns {*}
	 */
	serialize(value) {
		return value;
	}

	toJSON() {
		return {
			name: this.name,
			default: this.default
		};
	}

	toString() {
		return `Dataset(${this.name})`;
	}

}

module.exports = Dataset;
