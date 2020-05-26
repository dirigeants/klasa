import { Language, LanguageStore, LanguageValue } from 'klasa';
export default class extends Language {
    language: Record<string, LanguageValue> & {
        DEFAULT: (term: string) => string;
    };
    constructor(store: LanguageStore, directory: string, file: string[]);
    init(): Promise<void>;
}
