"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const klasa_1 = require("klasa");
class CoreMultiArgument extends klasa_1.MultiArgument {
    constructor(store, directory, file) {
        super(store, directory, file, { aliases: ['...dmChannel'] });
    }
    get base() {
        return this.store.get('dmChannel');
    }
}
exports.default = CoreMultiArgument;
//# sourceMappingURL=dmChannels.js.map