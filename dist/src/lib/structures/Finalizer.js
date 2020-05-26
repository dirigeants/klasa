"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Finalizer = void 0;
const core_1 = require("@klasa/core");
/**
 * Base class for all Klasa Finalizers. See {@tutorial CreatingFinalizers} for more information how to use this class
 * to build custom finalizers.
 * @tutorial CreatingFinalizers
 * @extends {Piece}
 */
class Finalizer extends core_1.Piece {
    /**
     * Run a finalizer and catch any uncaught promises
     * @since 0.5.0
     * @param message The message that called the command
     * @param command The command this finalizer is for (may be different than message.command)
     * @param responses The bot's response message, if one is returned
     * @param runTime The time it took to generate the command
     */
    async _run(message, command, responses, runTime) {
        try {
            await this.run(message, command, responses, runTime);
        }
        catch (err) {
            this.client.emit('finalizerError', message, command, responses, runTime, this, err);
        }
    }
}
exports.Finalizer = Finalizer;
//# sourceMappingURL=Finalizer.js.map