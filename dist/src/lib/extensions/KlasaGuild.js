"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KlasaGuild = void 0;
const core_1 = require("@klasa/core");
/**
 * Klasa's Extended Guild
 * @extends external:Guild
 */
class KlasaGuild extends core_1.extender.get('Guild') {
    constructor(...args) {
        super(...args);
        this.settings = this.client.gateways.get('guilds').acquire(this);
    }
    /**
     * The language configured for this guild
     */
    get language() {
        return this.client.languages.get(this.settings.get('language'));
    }
    /**
     * Returns the JSON-compatible object of this instance.
     * @since 0.5.0
     */
    toJSON() {
        return { ...super.toJSON(), settings: this.settings.toJSON() };
    }
}
exports.KlasaGuild = KlasaGuild;
core_1.extender.extend('Guild', () => KlasaGuild);
//# sourceMappingURL=KlasaGuild.js.map