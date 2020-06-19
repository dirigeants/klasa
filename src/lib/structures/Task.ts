import { Piece } from '@klasa/core';

/**
 * Base class for all Klasa Task pieces. See {@tutorial CreatingTasks} for more information how to use this class
 * to build custom tasks.
 * @tutorial CreatingTasks
 * @extends {Piece}
 */
export abstract class Task extends Piece {

	/**
	 * The run method to be overwritten in actual Task pieces
	 * @since 0.5.0
	 * @param data The data from the ScheduledTask instance
	 */
	public abstract async run(data: TaskData): Promise<void>;

}

export interface TaskData extends Record<PropertyKey, unknown> {
	id: string;
}
