"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const klasa_1 = require("klasa");
class CoreMultiArgument extends klasa_1.MultiArgument {
    constructor(store, directory, file) {
        super(store, directory, file, { aliases: ['...store'] });
    }
    get base() {
        return this.store.get('store');
    }
}
exports.default = CoreMultiArgument;
//# sourceMappingURL=stores.js.map