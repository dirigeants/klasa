"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@klasa/core");
class default_1 extends core_1.Event {
    constructor(store, directory, file) {
        super(store, directory, file, { emitter: process });
        if (this.client.options.production)
            this.unload();
    }
    run(error) {
        if (!error)
            return;
        this.client.emit('error', `Uncaught Promise Error: \n${error.stack || error}`);
    }
}
exports.default = default_1;
//# sourceMappingURL=unhandledRejection.js.map