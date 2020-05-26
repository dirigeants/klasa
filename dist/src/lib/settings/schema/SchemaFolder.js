"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemaFolder = void 0;
const Schema_1 = require("./Schema");
class SchemaFolder extends Schema_1.Schema {
    /**
     * Constructs a SchemaFolder instance.
     * @param parent The schema that manages this instance
     * @param key This folder's key name
     */
    constructor(parent, key) {
        super(parent.path.length === 0 ? key : `${parent.path}.${key}`);
        this.parent = parent;
        this.key = key;
    }
}
exports.SchemaFolder = SchemaFolder;
//# sourceMappingURL=SchemaFolder.js.map