import { Piece } from '@klasa/core';

/**
 * Base class for all Klasa Task pieces. See {@tutorial CreatingTasks} for more information how to use this class
 * to build custom tasks.
 * @tutorial CreatingTasks
 * @extends {Piece}
 */
export class Task extends Piece {

	/**
	 * The run method to be overwritten in actual Task pieces
	 * @since 0.5.0
	 * @param {*} data The data from the ScheduledTask instance
	 * @returns {void}
	 * @abstract
	 */
	async run() {
		// Defined in extension Classes
		throw new Error(`The run method has not been implemented by ${this.type}:${this.name}.`);
	}

}
