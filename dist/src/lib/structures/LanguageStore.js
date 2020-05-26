"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LanguageStore = void 0;
const Language_1 = require("./Language");
const core_1 = require("@klasa/core");
/**
 * Stores all {@link Language} pieces for use in Klasa.
 * @since 0.0.1
 */
class LanguageStore extends core_1.Store {
    /**
     * Constructs our LanguageStore for use in Klasa.
     * @since 0.0.1
     * @param client The Klasa client
     */
    constructor(client) {
        super(client, 'languages', Language_1.Language);
    }
    /**
     * The default language set in {@link KlasaClientOptions.language}
     * @since 0.2.1
     */
    get default() {
        return this.get(this.client.options.language);
    }
}
exports.LanguageStore = LanguageStore;
//# sourceMappingURL=LanguageStore.js.map