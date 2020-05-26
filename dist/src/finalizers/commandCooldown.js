"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const klasa_1 = require("klasa");
const ratelimits_1 = require("@klasa/ratelimits");
class default_1 extends klasa_1.Finalizer {
    constructor() {
        super(...arguments);
        this.cooldowns = new WeakMap();
    }
    run(message, command) {
        if (command.cooldown <= 0 || this.client.owners.has(message.author))
            return;
        try {
            this.getCooldown(message, command).drip();
        }
        catch (err) {
            this.client.emit('error', `${message.author.username}[${message.author.id}] has exceeded the RateLimit for ${message.command}`);
        }
    }
    getCooldown(message, command) {
        let cooldownManager = this.cooldowns.get(command);
        if (!cooldownManager) {
            cooldownManager = new ratelimits_1.RateLimitManager(command.bucket, command.cooldown * 1000);
            this.cooldowns.set(command, cooldownManager);
        }
        return cooldownManager.acquire(message.guild ? Reflect.get(message, command.cooldownLevel).id : message.author.id);
    }
}
exports.default = default_1;
//# sourceMappingURL=commandCooldown.js.map