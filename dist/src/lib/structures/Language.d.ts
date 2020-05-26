import { Piece } from '@klasa/core';
import type { LanguageStore } from './LanguageStore';
export declare type LanguageValue = string | ((...args: any[]) => string);
/**
 * Base class for all Klasa Languages. See {@tutorial CreatingLanguages} for more information how to use this class
 * to build custom languages.
 * @tutorial CreatingLanguages
 */
export declare abstract class Language extends Piece {
    abstract language: Record<string, LanguageValue> & {
        DEFAULT: (term: string) => string;
    };
    /**
     * The method to get language strings
     * @since 0.2.1
     * @param term The string or function to look up
     * @param args Any arguments to pass to the lookup
     */
    get(term: string, ...args: readonly unknown[]): string;
    /**
     * The init method to be optionally overwritten in actual languages
     * @since 0.2.1
     * @abstract
     */
    init(): Promise<void>;
}
export interface Language {
    store: LanguageStore;
}
