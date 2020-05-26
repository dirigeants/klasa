"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Language = void 0;
const fs_nextra_1 = require("fs-nextra");
const path_1 = require("path");
const core_1 = require("@klasa/core");
const utils_1 = require("@klasa/utils");
/**
 * Base class for all Klasa Languages. See {@tutorial CreatingLanguages} for more information how to use this class
 * to build custom languages.
 * @tutorial CreatingLanguages
 */
class Language extends core_1.Piece {
    /**
     * The method to get language strings
     * @since 0.2.1
     * @param term The string or function to look up
     * @param args Any arguments to pass to the lookup
     */
    get(term, ...args) {
        if (!this.enabled && this !== this.store.default)
            return this.store.default.get(term, ...args);
        const value = this.language[term];
        /* eslint-disable new-cap */
        switch (typeof value) {
            case 'function': return value(...args);
            case 'undefined':
                if (this === this.store.default)
                    return this.language.DEFAULT(term);
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
    async init() {
        // eslint-disable-next-line dot-notation
        for (const core of this.store['coreDirectories']) {
            const loc = path_1.join(core, ...this.file);
            if (this.directory !== core && await fs_nextra_1.pathExists(loc)) {
                try {
                    const loaded = await Promise.resolve().then(() => require(loc));
                    const LoadedPiece = 'default' in loaded ? loaded.default : loaded;
                    if (!utils_1.isClass(LoadedPiece))
                        return;
                    const coreLang = new LoadedPiece(this.store, this.directory, this.file);
                    this.language = utils_1.mergeDefault(coreLang.language, this.language);
                }
                catch (error) {
                    return;
                }
            }
        }
        return;
    }
}
exports.Language = Language;
//# sourceMappingURL=Language.js.map