const Piece = require('./interfaces/Piece');
const { mergeDefault } = require('../util/util');

/**
 * Base class for all Klasa Task pieces. See {@tutorial CreatingTasks} for more information how to use this class
 * to build custom tasks.
 * @tutorial CreatingTasks
 * @implements {Piece}
 */
class Task extends Piece {

	/**
	 * @typedef {Object} TaskOptions
	 * @property {string} [name=theFileName] The name of the task
	 * @property {boolean} [enabled=true] Whether the task is enabled or not
	 * @memberof Task
	 */

	/**
	 * @since 0.5.0
	 * @param {KlasaClient} client The Klasa client
	 * @param {string} file The path from the pieces folder to the task piece file
	 * @param {boolean} core If the piece is in the core directory or not
	 * @param {TaskOptions} [options={}] Optional Task settings
	 */
	constructor(client, file, core, options = {}) {
		options = mergeDefault(client.options.pieceDefaults.tasks, options);
		super(client, 'task', file, core, options);
	}

	/**
	 * The run method to be overwritten in actual Task pieces
	 * @since 0.5.0
	 * @param {*} data The data from the ScheduledTask instance
	 * @returns {Promise<void>}
	 * @abstract
	 */
	run() {
		// Defined in extension Classes
	}

	/**
	 * The init method to be optionally overwritten in actual Task pieces
	 * @since 0.5.0
	 * @returns {Promise<void>}
	 * @abstract
	 */
	async init() {
		// Optionally defined in extension Classes
	}

}

module.exports = Task;
