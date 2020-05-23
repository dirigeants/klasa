import { Cache } from '@klasa/cache';

import type { Message } from '@klasa/core';

const empty = Symbol('empty');

export type CheckFunction = (message: Message) => boolean | null | Promise<boolean | null>;

export interface PermissionLevelsLevel {
	check: CheckFunction;
	fetch: boolean;
	break: boolean;
}

export type PermissionLevelOptions = Partial<Pick<PermissionLevelsLevel, 'fetch' | 'break'>>;

export interface PermissionLevelsData {
	broke: boolean;
	permission: boolean;
}

/**
 * Permission levels. See {@tutorial UnderstandingPermissionLevels} for more information how to use this class
 * to define custom permissions.
 * @tutorial UnderstandingPermissionLevels
 */
export class PermissionLevels extends Cache<number, typeof empty | PermissionLevelsLevel> {

	constructor(levels = 11) {
		super();

		for (let i = 0; i < levels; i++) super.set(i, empty);
	}

	public set(): never {
		throw new Error('Cannot set to PermissionLevels directly. Use PermissionLevels#add instead.');
	}

	public delete(): never {
		throw new Error('Cannot delete from PermissionLevels directly. Use PermissionLevels#remove instead.');
	}

	/**
	 * Adds levels to the levels cache
	 * @since 0.2.1
	 * @param level The permission number for the level you are defining
	 * @param check The permission checking function
	 * @param options If the permission should auto fetch members
	 */
	public add(level: number, check: CheckFunction, options: PermissionLevelOptions = {}): this {
		return this._set(level, { check, break: Boolean(options.break), fetch: Boolean(options.fetch) });
	}

	/**
	 * Removes levels from the levels cache
	 * @since 0.5.0
	 * @param level The permission number for the level you are removing
	 */
	public remove(level: number): this {
		return this._set(level, empty);
	}

	/**
	 * Checks if all permission levels are valid
	 * @since 0.2.1
	 */
	public isValid(): boolean {
		return this.every(level => level === empty || (typeof level === 'object' && typeof level.break === 'boolean' && typeof level.fetch === 'boolean' && typeof level.check === 'function'));
	}

	/**
	 * Returns any errors in the perm levels
	 * @since 0.2.1
	 */
	public debug(): string {
		const errors = [];
		for (const [index, level] of this) {
			if (level === empty) continue;
			if (typeof level !== 'object') errors.push(`Permission level ${index} must be an object`);
			if (typeof level.break !== 'boolean') errors.push(`"break" in permission level ${index} must be a boolean`);
			if (typeof level.fetch !== 'boolean') errors.push(`"fetch" in permission level ${index} must be a boolean`);
			if (typeof level.check !== 'function') errors.push(`"check" in permission level ${index} must be a function`);
		}
		return errors.join('\n');
	}

	/**
	 * Runs the defined permissionLevels
	 * @since 0.2.1
	 * @param message The message to pass to perm level functions
	 * @param min The minimum permissionLevel ok to pass
	 */
	public async run(message: Message, min: number): Promise<PermissionLevelsData> {
		for (let i = min; i < this.size; i++) {
			const level = this.get(i);
			if (!level || level === empty) continue;
			if (level.fetch && !message.member && message.guild) await message.guild.members.fetch(message.author.id);
			const res = await level.check(message);
			if (res) return { broke: false, permission: true };
			if (level.break) return { broke: true, permission: false };
		}
		return { broke: false, permission: false };
	}

	/**
	 * Validates the permission levels, throwing an error if something is wrong
	 * @since 0.6.0
	 */
	protected validate(): this {
		if (this.isValid()) return this;
		throw new Error(this.debug());
	}

	/**
	 * Adds levels to the levels cache to be converted to valid permission structure
	 * @since 0.2.1
	 * @param level The permission number for the level you are defining
	 * @param obj Whether the level should break (stop processing higher levels, and inhibit a no permission error)
	 */
	protected _set(level: number, obj: typeof empty | PermissionLevelsLevel): this {
		if (level < 0) throw new Error(`Cannot set permission level ${level}. Permission levels start at 0.`);
		if (level > (this.size - 1)) throw new Error(`Cannot set permission level ${level}. Permission levels stop at ${this.size - 1}.`);
		return super.set(level, obj);
	}

	public static get [Symbol.species](): typeof Cache {
		return Cache;
	}

}
