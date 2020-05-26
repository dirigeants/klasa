import type { Settings } from '../settings/Settings';
import type { Language } from '../structures/Language';
declare const KlasaGuild_base: import("@klasa/core").Constructor<import("@klasa/core").Guild>;
/**
 * Klasa's Extended Guild
 * @extends external:Guild
 */
export declare class KlasaGuild extends KlasaGuild_base {
    /**
     * The guild level settings for this context (guild || default)
     * @since 0.5.0
     */
    settings: Settings;
    constructor(...args: any[]);
    /**
     * The language configured for this guild
     */
    get language(): Language;
    /**
     * Returns the JSON-compatible object of this instance.
     * @since 0.5.0
     */
    toJSON(): Record<string, any>;
}
export {};
