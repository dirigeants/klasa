const { join } = require('path');
const { Collection } = require('discord.js');
const Task = require('./Task');
const Store = require('./interfaces/Store');

/**
 * Stores all task pieces for use in Klasa
 * @extends external:Collection
 * @implements {Store}
 */
class TaskStore extends Collection {

	/**
	 * Constructs our TaskStore for use in Klasa
	 * @since 0.5.0
	 * @param {KlasaClient} client The Klasa client
	 */
	constructor(client) {
		super();

		/**
		 * The client this TaskStore was created with.
		 * @since 0.5.0
		 * @name TaskStore#client
		 * @type {KlasaClient}
		 * @readonly
		 */
		Object.defineProperty(this, 'client', { value: client });

		/**
		 * The directory of core task pieces in Klasa relative to where its installed.
		 * @since 0.5.0
		 * @type {string}
		 */
		this.coreDir = join(this.client.coreBaseDir, 'tasks');

		/**
		 * The directory of local task pieces relative to where you run Klasa from.
		 * @since 0.5.0
		 * @type {string}
		 */
		this.userDir = join(this.client.clientBaseDir, 'tasks');

		/**
		 * The type of structure this store holds
		 * @since 0.5.0
		 * @type {Task}
		 */
		this.holds = Task;

		/**
		 * The name of what this holds
		 * @since 0.5.0
		 * @type {string}
		 */
		this.name = 'tasks';
	}

	/**
	 * Deletes a Task piece from the store
	 * @since 0.5.0
	 * @param {Task|string} name The Task piece instance or a string representing the structure this store caches
	 * @returns {boolean} whether or not the delete was successful.
	 */
	delete(name) {
		const piece = this.resolve(name);
		if (!piece) return false;
		super.delete(piece.name);
		return true;
	}

	/**
	 * Sets up a Task piece in our store.
	 * @since 0.5.0
	 * @param {Task} task The task piece instance we are setting up
	 * @returns {Task}
	 */
	set(task) {
		if (!(task instanceof this.holds)) return this.client.emit('error', `Only ${this.name} may be stored in the Store.`);
		const existing = this.get(task.name);
		if (existing) this.delete(existing);
		else if (this.client.listenerCount('pieceLoaded')) this.client.emit('pieceLoaded', task);
		super.set(task.name, task);
		return task;
	}

	// left for documentation
	/* eslint-disable no-empty-function */
	init() { }
	load() { }
	async loadAll() { }
	resolve() { }
	/* eslint-enable no-empty-function */

}

Store.applyToClass(TaskStore);

module.exports = TaskStore;
