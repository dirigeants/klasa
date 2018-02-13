const Task = require('./Task');
const Store = require('./base/Store');

/**
 * Stores all task pieces for use in Klasa
 * @extends Store
 */
class TaskStore extends Store {

	/**
	 * Constructs our TaskStore for use in Klasa
	 * @since 0.5.0
	 * @param {KlasaClient} client The Klasa client
	 */
	constructor(client) {
		super(client, 'tasks', Task);
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

}

module.exports = TaskStore;
