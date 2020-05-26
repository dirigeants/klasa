"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const klasa_1 = require("klasa");
class CoreMultiArgument extends klasa_1.MultiArgument {
    constructor(store, directory, file) {
        super(store, directory, file, { aliases: ['...voiceChannel'] });
    }
    get base() {
        return this.store.get('voiceChannel');
    }
}
exports.default = CoreMultiArgument;
//# sourceMappingURL=voiceChannels.js.map