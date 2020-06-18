"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Inhibitor = void 0;
const core_1 = require("@klasa/core");
/**
 * Base class for all Klasa Inhibitors. See {@tutorial CreatingInhibitors} for more information how to use this class
 * to build custom inhibitors.
 * @tutorial CreatingInhibitors
 * @extends Piece
 */
class Inhibitor extends core_1.Piece {
    /**
     * @since 0.0.1
     * @param store The Inhibitor Store
     * @param file The path from the pieces folder to the inhibitor file
     * @param directory The base directory to the pieces folder
     * @param options Optional Inhibitor settings
     */
    constructor(store, directory, files, options = {}) {
        super(store, directory, files, options);
        this.spamProtection = options.spamProtection ?? false;
    }
    /**
     * The async wrapper for running inhibitors
     * @since 0.5.0
     * @param message The message that triggered this inhibitor
     * @param command The command to run
     */
    async _run(message, command) {
        try {
            return await this.run(message, command);
        }
        catch (err) {
            return err;
        }
    }
    /**
     * Defines the JSON.stringify behavior of this inhibitor.
     */
    toJSON() {
        return {
            ...super.toJSON(),
            spamProtection: this.spamProtection
        };
    }
}
exports.Inhibitor = Inhibitor;
//# sourceMappingURL=Inhibitor.js.map