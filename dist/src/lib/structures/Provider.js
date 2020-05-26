"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Provider = void 0;
const core_1 = require("@klasa/core");
const utils_1 = require("@klasa/utils");
class Provider extends core_1.Piece {
    /**
     * Shutdown method, this is called before the piece is unloaded.
     */
    shutdown() {
        // Optionally defined in extension Classes
        return undefined;
    }
    /**
     * The addColumn method which inserts/creates a new table to the database.
     * @param table The table to check against
     * @param entry The SchemaFolder or SchemaEntry added to the schema
     */
    /* istanbul ignore next: Implemented in SQLProvider, always unused. */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async addColumn(_table, _entry) {
        // Reserved for SQL databases
        return undefined;
    }
    /**
     * The removeColumn method which inserts/creates a new table to the database.
     * @since 0.5.0
     * @param table The table to check against
     * @param columns The column names to remove
     */
    /* istanbul ignore next: Implemented in SQLProvider, always unused. */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async removeColumn(_table, _columns) {
        // Reserved for SQL databases
        return undefined;
    }
    /**
     * The updateColumn method which alters the datatype from a column.
     * @param table The table to check against
     * @param entry The modified SchemaEntry
     */
    /* istanbul ignore next: Implemented in SQLProvider, always unused. */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async updateColumn(_table, _entry) {
        // Reserved for SQL databases
        return undefined;
    }
    /**
     * The getColumns method which gets the name of all columns.
     * @param table The table to check against
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async getColumns(_table) {
        // Reserved for SQL databases
        return [];
    }
    /**
     * Process the input from {@link Settings#update} or {@link Settings#reset} into a plain unknown that can be used for
     * document-based database drivers. If it receives a non-array, it returns the value without further processing.
     * @param changes The data that has been updated
     */
    parseUpdateInput(changes) {
        if (!Array.isArray(changes))
            return changes;
        const updated = {};
        for (const change of changes)
            utils_1.mergeObjects(updated, utils_1.makeObject(change.entry.path, change.next));
        return updated;
    }
}
exports.Provider = Provider;
//# sourceMappingURL=Provider.js.map