"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskStore = void 0;
const Task_1 = require("./Task");
const core_1 = require("@klasa/core");
/**
 * Stores all {@link Task} pieces for use in Klasa.
 * @since 0.5.0
 */
class TaskStore extends core_1.Store {
    /**
     * Constructs our TaskStore for use in Klasa.
     * @since 0.5.0
     * @param client The Klasa client
     */
    constructor(client) {
        super(client, 'tasks', Task_1.Task);
    }
}
exports.TaskStore = TaskStore;
//# sourceMappingURL=TaskStore.js.map