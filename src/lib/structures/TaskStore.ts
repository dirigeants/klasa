import { Store, PieceConstructor, Client } from '@klasa/core';
import { Task } from './Task';

/**
 * Stores all {@link Task} pieces for use in Klasa.
 * @since 0.5.0
 */
export class TaskStore extends Store<Task> {

	/**
	 * Constructs our TaskStore for use in Klasa.
	 * @since 0.5.0
	 * @param client The Klasa client
	 */
	public constructor(client: Client) {
		super(client, 'tasks', Task as PieceConstructor<Task>);
	}

}
