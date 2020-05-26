"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtendableStore = void 0;
const Extendable_1 = require("./Extendable");
const core_1 = require("@klasa/core");
/**
 * Stores all {@link Extendable} pieces for use in Klasa.
 * @since 0.0.1
 */
class ExtendableStore extends core_1.Store {
    /**
     * Constructs our ExtendableStore for use in Klasa.
     * @since 0.0.1
     * @param client The Klasa client
     */
    constructor(client) {
        super(client, 'extendables', Extendable_1.Extendable);
    }
    /**
     * Deletes an extendable from the store.
     * @since 0.0.1
     * @param name A extendable object or a string representing a command or alias name
     */
    remove(name) {
        const extendable = this.resolve(name);
        if (!extendable)
            return false;
        extendable.disable();
        return super.remove(extendable);
    }
    /**
     * Clears the extendable from the store and removes the extensions.
     * @since 0.0.1
     */
    clear() {
        for (const extendable of this.values())
            this.remove(extendable);
    }
    /**
     * Sets up an extendable in our store.
     * @since 0.0.1
     * @param piece The extendable piece we are setting up
     */
    add(piece) {
        const extendable = super.add(piece);
        if (!extendable)
            return null;
        extendable.init();
        return extendable;
    }
}
exports.ExtendableStore = ExtendableStore;
//# sourceMappingURL=ExtendableStore.js.map