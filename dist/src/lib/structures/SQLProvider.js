"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SQLProvider = void 0;
const utils_1 = require("@klasa/utils");
const Provider_1 = require("./Provider");
class SQLProvider extends Provider_1.Provider {
    /**
     * The query builder debug check for errors in the QueryBuilder, if one exists in the extended SQLProvider instance
     */
    async init() {
        if (!this.qb)
            return;
        const errors = this.qb.debug();
        if (errors)
            throw new Error(errors);
    }
    /**
     * Process the input from {@link Settings#update} or {@link Settings#reset} into an unknown with the keys and values
     * that can be used for schema-based (SQL) database drivers. If it receives a non-array, it is flattened into a
     * dotted unknown notation. Please note that this behaviour may be tricky when working with a {@link SchemaEntry}
     * which type accepts an unknown and it's not an array, as it'll be flattened into as many keys as properties it has.
     */
    parseTupleUpdateInput(changes) {
        const keys = [];
        const values = [];
        if (Array.isArray(changes)) {
            for (const change of changes) {
                keys.push(change.entry.key);
                values.push(change.next);
            }
        }
        else {
            for (const [key, value] of utils_1.objectToTuples(changes)) {
                keys.push(key);
                values.push(value);
            }
        }
        return { keys, values };
    }
}
exports.SQLProvider = SQLProvider;
//# sourceMappingURL=SQLProvider.js.map