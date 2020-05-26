import type { Settings } from '../settings/Settings';
declare const KlasaUser_base: import("@klasa/core").Constructor<import("@klasa/core").User<import("@klasa/core").Client>>;
/**
 * Klasa's Extended User
 * @extends external:User
 */
export declare class KlasaUser extends KlasaUser_base {
    /**
     * The user level settings for this context (user || default)
     * @since 0.5.0
     */
    settings: Settings;
    constructor(...args: readonly unknown[]);
    /**
     * Returns the JSON-compatible object of this instance.
     * @since 0.5.0
     */
    toJSON(): Record<string, any>;
}
export {};
