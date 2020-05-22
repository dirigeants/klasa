import { Task } from './Task';
import { Store } from '@klasa/core';

/**
 * Stores all task pieces for use in Klasa
 * @extends Store
 */
export class TaskStore extends Store {

	/**
	 * Constructs our TaskStore for use in Klasa
	 * @since 0.5.0
	 * @param {KlasaClient} client The Klasa client
	 */
	constructor(client) {
		super(client, 'tasks', Task);
	}

}
