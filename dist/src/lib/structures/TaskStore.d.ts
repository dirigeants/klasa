import { Store, Client } from '@klasa/core';
import { Task } from './Task';
/**
 * Stores all {@link Task} pieces for use in Klasa.
 * @since 0.5.0
 */
export declare class TaskStore extends Store<Task> {
    /**
     * Constructs our TaskStore for use in Klasa.
     * @since 0.5.0
     * @param client The Klasa client
     */
    constructor(client: Client);
}
