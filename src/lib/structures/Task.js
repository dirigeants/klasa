const Piece = require('./interfaces/Piece');
const { mergeDefault } = require('../util/util');

/**
 * Base class for all Klasa Task pieces. See {@tutorial CreatingTasks} for more information how to use this class
 * to build custom tasks.
 * @tutorial CreatingTasks
 * @implements {Piece}
 */
class Task {

	/**
	 * @typedef {Object} TaskOptions
	 * @property {string} [name=theFileName] The name of the task
	 * @property {boolean} [enabled=true] Whether the task is enabled or not
	 * @memberof Task
	 */

	/**
	 * @since 0.5.0
	 * @param {KlasaClient} client The Klasa client
	 * @param {string} dir The path to the core or user task pieces folder
	 * @param {string} file The path from the pieces folder to the task piece file
	 * @param {TaskOptions} [options={}] Optional Task settings
	 */
	constructor(client, dir, file, options = {}) {
		options = mergeDefault(client.options.pieceDefaults.tasks, options);

		/**
		 * @since 0.5.0
		 * @type {KlasaClient}
		 */
		this.client = client;

		/**
		 * The type of Klasa piece this is
		 * @since 0.5.0
		 * @type {string}
		 */
		this.type = 'task';

		/**
		 * If the Task is enabled or not
		 * @since 0.5.0
		 * @type {boolean}
		 */
		this.enabled = options.enabled;

		/**
		 * The name of the task
		 * @since 0.5.0
		 * @type {string}
		 */
		this.name = options.name || file.slice(0, -3);

		/**
		 * The directory to where this task piece is stored
		 * @since 0.5.0
		 * @type {string}
		 */
		this.dir = dir;

		/**
		 * The file location where this task piece is stored
		 * @since 0.5.0
		 * @type {string}
		 */
		this.file = file;
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

	// left for documentation
	/* eslint-disable no-empty-function */
	async reload() {}
	unload() {}
	disable() {}
	enable() {}
	toString() {}
	toJSON() {}
	/* eslint-enable no-empty-function */

}

Piece.applyToClass(Task);

module.exports = Task;
