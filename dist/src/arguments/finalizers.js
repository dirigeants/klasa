"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const klasa_1 = require("klasa");
class CoreMultiArgument extends klasa_1.MultiArgument {
    constructor(store, directory, file) {
        super(store, directory, file, { aliases: ['...finalizer'] });
    }
    get base() {
        return this.store.get('finalizer');
    }
}
exports.default = CoreMultiArgument;
//# sourceMappingURL=finalizers.js.map