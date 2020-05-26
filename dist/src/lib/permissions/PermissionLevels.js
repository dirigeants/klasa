"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionLevels = void 0;
const cache_1 = require("@klasa/cache");
const empty = Symbol('empty');
/**
 * Permission levels. See {@tutorial UnderstandingPermissionLevels} for more information how to use this class
 * to define custom permissions.
 * @tutorial UnderstandingPermissionLevels
 */
class PermissionLevels extends cache_1.Cache {
    constructor(levels = 11) {
        super();
        for (let i = 0; i < levels; i++)
            super.set(i, empty);
    }
    set() {
        throw new Error('Cannot set to PermissionLevels directly. Use PermissionLevels#add instead.');
    }
    delete() {
        throw new Error('Cannot delete from PermissionLevels directly. Use PermissionLevels#remove instead.');
    }
    /**
     * Adds levels to the levels cache
     * @since 0.2.1
     * @param level The permission number for the level you are defining
     * @param check The permission checking function
     * @param options If the permission should auto fetch members
     */
    add(level, check, options = {}) {
        return this._set(level, { check, break: Boolean(options.break), fetch: Boolean(options.fetch) });
    }
    /**
     * Removes levels from the levels cache
     * @since 0.5.0
     * @param level The permission number for the level you are removing
     */
    remove(level) {
        return this._set(level, empty);
    }
    /**
     * Checks if all permission levels are valid
     * @since 0.2.1
     */
    isValid() {
        return this.every(level => level === empty || (typeof level === 'object' && typeof level.break === 'boolean' && typeof level.fetch === 'boolean' && typeof level.check === 'function'));
    }
    /**
     * Returns any errors in the perm levels
     * @since 0.2.1
     */
    debug() {
        const errors = [];
        for (const [index, level] of this) {
            if (level === empty)
                continue;
            if (typeof level !== 'object')
                errors.push(`Permission level ${index} must be an object`);
            if (typeof level.break !== 'boolean')
                errors.push(`"break" in permission level ${index} must be a boolean`);
            if (typeof level.fetch !== 'boolean')
                errors.push(`"fetch" in permission level ${index} must be a boolean`);
            if (typeof level.check !== 'function')
                errors.push(`"check" in permission level ${index} must be a function`);
        }
        return errors.join('\n');
    }
    /**
     * Runs the defined permissionLevels
     * @since 0.2.1
     * @param message The message to pass to perm level functions
     * @param min The minimum permissionLevel ok to pass
     */
    async run(message, min) {
        for (let i = min; i < this.size; i++) {
            const level = this.get(i);
            if (!level || level === empty)
                continue;
            if (level.fetch && !message.member && message.guild)
                await message.guild.members.fetch(message.author.id);
            const res = await level.check(message);
            if (res)
                return { broke: false, permission: true };
            if (level.break)
                return { broke: true, permission: false };
        }
        return { broke: false, permission: false };
    }
    /**
     * Validates the permission levels, throwing an error if something is wrong
     * @since 0.6.0
     */
    validate() {
        if (this.isValid())
            return this;
        throw new Error(this.debug());
    }
    /**
     * Adds levels to the levels cache to be converted to valid permission structure
     * @since 0.2.1
     * @param level The permission number for the level you are defining
     * @param obj Whether the level should break (stop processing higher levels, and inhibit a no permission error)
     */
    _set(level, obj) {
        if (level < 0)
            throw new Error(`Cannot set permission level ${level}. Permission levels start at 0.`);
        if (level > (this.size - 1))
            throw new Error(`Cannot set permission level ${level}. Permission levels stop at ${this.size - 1}.`);
        return super.set(level, obj);
    }
    static get [Symbol.species]() {
        return cache_1.Cache;
    }
}
exports.PermissionLevels = PermissionLevels;
//# sourceMappingURL=PermissionLevels.js.map