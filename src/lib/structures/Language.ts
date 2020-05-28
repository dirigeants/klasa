import { pathExists } from 'fs-nextra';
import { join } from 'path';
import { Piece, PieceConstructor } from '@klasa/core';
import { mergeDefault, isClass } from '@klasa/utils';

import type { LanguageStore } from './LanguageStore';

export type LanguageValue = string | ((...args: any[]) => string);

/**
 * Base class for all Klasa Languages. See {@tutorial CreatingLanguages} for more information how to use this class
 * to build custom languages.
 * @tutorial CreatingLanguages
 */
export abstract class Language extends Piece {

	public abstract language: Record<string, LanguageValue> & { DEFAULT: (term: string) => string };

	/**
	 * The method to get language strings
	 * @since 0.2.1
	 * @param term The string or function to look up
	 * @param args Any arguments to pass to the lookup
	 */
	public get(term: string, ...args: readonly unknown[]): string {
		if (!this.enabled && this !== this.store.default) return this.store.default.get(term, ...args);
		const value = this.language[term];
		/* eslint-disable new-cap */
		switch (typeof value) {
			case 'function': return value(...args);
			case 'undefined':
				if (this === this.store.default) return this.language.DEFAULT(term);
				return `${this.language.DEFAULT(term)}\n\n**${this.language.DEFAULT_LANGUAGE}:**\n${this.store.default.get(term, ...args)}`;
			default: return Array.isArray(value) ? value.join('\n') : value;
		}
		/* eslint-enable new-cap */
	}

	/**
	 * The init method to be optionally overwritten in actual languages
	 * @since 0.2.1
	 * @abstract
	 */
	async init(): Promise<void> {
		// eslint-disable-next-line dot-notation
		for (const core of this.store['coreDirectories']) {
			const loc = join(core, ...this.file);
			if (this.directory !== core && await pathExists(loc)) {
				try {
					const loaded = await import(loc) as { default: PieceConstructor<Language> } | PieceConstructor<Language>;
					const LoadedPiece = 'default' in loaded ? loaded.default : loaded;
					if (!isClass(LoadedPiece)) return;
					const coreLang = new LoadedPiece(this.store, this.directory, this.file);
					this.language = mergeDefault(coreLang.language, this.language);
				} catch (error) {
					return;
				}
			}
		}
		return;
	}

}

export interface Language {
	store: LanguageStore;
}
