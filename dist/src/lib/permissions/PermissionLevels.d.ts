import { Cache } from '@klasa/cache';
import { KlasaMessage } from '../extensions/KlasaMessage';
declare const empty: unique symbol;
export declare type CheckFunction = (message: KlasaMessage) => boolean | null | Promise<boolean | null>;
export interface PermissionLevelsLevel {
    check: CheckFunction;
    fetch: boolean;
    break: boolean;
}
export declare type PermissionLevelOptions = Partial<Pick<PermissionLevelsLevel, 'fetch' | 'break'>>;
export interface PermissionLevelsData {
    broke: boolean;
    permission: boolean;
}
/**
 * Permission levels. See {@tutorial UnderstandingPermissionLevels} for more information how to use this class
 * to define custom permissions.
 * @tutorial UnderstandingPermissionLevels
 */
export declare class PermissionLevels extends Cache<number, typeof empty | PermissionLevelsLevel> {
    constructor(levels?: number);
    set(): never;
    delete(): never;
    /**
     * Adds levels to the levels cache
     * @since 0.2.1
     * @param level The permission number for the level you are defining
     * @param check The permission checking function
     * @param options If the permission should auto fetch members
     */
    add(level: number, check: CheckFunction, options?: PermissionLevelOptions): this;
    /**
     * Removes levels from the levels cache
     * @since 0.5.0
     * @param level The permission number for the level you are removing
     */
    remove(level: number): this;
    /**
     * Checks if all permission levels are valid
     * @since 0.2.1
     */
    isValid(): boolean;
    /**
     * Returns any errors in the perm levels
     * @since 0.2.1
     */
    debug(): string;
    /**
     * Runs the defined permissionLevels
     * @since 0.2.1
     * @param message The message to pass to perm level functions
     * @param min The minimum permissionLevel ok to pass
     */
    run(message: KlasaMessage, min: number): Promise<PermissionLevelsData>;
    /**
     * Validates the permission levels, throwing an error if something is wrong
     * @since 0.6.0
     */
    protected validate(): this;
    /**
     * Adds levels to the levels cache to be converted to valid permission structure
     * @since 0.2.1
     * @param level The permission number for the level you are defining
     * @param obj Whether the level should break (stop processing higher levels, and inhibit a no permission error)
     */
    protected _set(level: number, obj: typeof empty | PermissionLevelsLevel): this;
    static get [Symbol.species](): typeof Cache;
}
export {};
