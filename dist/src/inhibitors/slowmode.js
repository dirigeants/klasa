"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const klasa_1 = require("klasa");
const ratelimits_1 = require("@klasa/ratelimits");
class default_1 extends klasa_1.Inhibitor {
    constructor(store, directory, files) {
        super(store, directory, files, { spamProtection: true });
        this.slowmode = new ratelimits_1.RateLimitManager(1, this.client.options.commands.slowmode);
        this.aggressive = this.client.options.commands.slowmodeAggressive;
        if (!this.client.options.commands.slowmode)
            this.disable();
    }
    run(message) {
        if (this.client.owners.has(message.author))
            return;
        const rateLimit = this.slowmode.acquire(message.author.id);
        try {
            rateLimit.drip();
        }
        catch (err) {
            if (this.aggressive)
                rateLimit.resetTime();
            throw true;
        }
    }
}
exports.default = default_1;
//# sourceMappingURL=slowmode.js.map