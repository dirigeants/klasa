"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KlasaUser = void 0;
const core_1 = require("@klasa/core");
/**
 * Klasa's Extended User
 * @extends external:User
 */
class KlasaUser extends core_1.extender.get('User') {
    constructor(...args) {
        super(...args);
        this.settings = this.client.gateways.get('users').acquire(this);
    }
    /**
     * Returns the JSON-compatible object of this instance.
     * @since 0.5.0
     */
    toJSON() {
        return { ...super.toJSON(), settings: this.settings };
    }
}
exports.KlasaUser = KlasaUser;
core_1.extender.extend('User', () => KlasaUser);
//# sourceMappingURL=KlasaUser.js.map