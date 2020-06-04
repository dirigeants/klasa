"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Argument = void 0;
const core_1 = require("@klasa/core");
const constants_1 = require("../util/constants");
/**
 * Base class for all Klasa Arguments. See {@tutorial CreatingArguments} for more information how to use this class
 * to build custom arguments.
 * @tutorial CreatingArguments
 */
class Argument extends core_1.AliasPiece {
    /**
     * Checks min and max values
     * @since 0.5.0
     * @param client The client of this bot
     * @param value The value to check against
     * @param min The minimum value
     * @param max The maximum value
     * @param possible The id of the current possible usage
     * @param message The message that triggered the command
     * @param suffix An error suffix
     */
    static minOrMax(client, value, min = null, max = null, possible, message, suffix) {
        const language = (message ? message.language : client.languages.default);
        suffix = suffix ? language.get(suffix) : '';
        if (min !== null && max !== null) {
            if (value >= min && value <= max)
                return true;
            if (min === max)
                throw language.get('RESOLVER_MINMAX_EXACTLY', possible.name, min, suffix);
            throw language.get('RESOLVER_MINMAX_BOTH', possible.name, min, max, suffix);
        }
        else if (min !== null) {
            if (value >= min)
                return true;
            throw language.get('RESOLVER_MINMAX_MIN', possible.name, min, suffix);
        }
        else if (max !== null) {
            if (value <= max)
                return true;
            throw language.get('RESOLVER_MINMAX_MAX', possible.name, max, suffix);
        }
        return true;
    }
}
exports.Argument = Argument;
/**
 * Standard regular expressions for matching mentions and snowflake ids
 * @since 0.5.0
 */
Argument.regex = constants_1.MENTION_REGEX;
//# sourceMappingURL=Argument.js.map