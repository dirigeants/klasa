import { Language } from './Language';
import { Store } from '@klasa/core';
import type { KlasaClient } from '../Client';
/**
 * Stores all {@link Language} pieces for use in Klasa.
 * @since 0.0.1
 */
export declare class LanguageStore extends Store<Language> {
    /**
     * Constructs our LanguageStore for use in Klasa.
     * @since 0.0.1
     * @param client The Klasa client
     */
    constructor(client: KlasaClient);
    /**
     * The default language set in {@link KlasaClientOptions.language}
     * @since 0.2.1
     */
    get default(): Language;
}
