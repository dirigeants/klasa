"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SerializerStore = void 0;
const Serializer_1 = require("./Serializer");
const core_1 = require("@klasa/core");
/**
 * Stores all {@link Serializer} pieces for use in Klasa.
 * @since 0.5.0
 */
class SerializerStore extends core_1.AliasStore {
    /**
     * Constructs our SerializerStore for use in Klasa.
     * @since 0.5.0
     * @param client The Klasa client
     */
    constructor(client) {
        super(client, 'serializers', Serializer_1.Serializer);
    }
}
exports.SerializerStore = SerializerStore;
//# sourceMappingURL=SerializerStore.js.map