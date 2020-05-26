"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Possible = void 0;
const regexTypes = ['reg', 'regex', 'regexp'];
/**
 * Represents a possibility in a usage Tag
 */
class Possible {
    /**
     * @param regexResults The regex results from parsing the tag member
     * @since 0.2.1
     */
    constructor([, name, type = 'literal', min, max, regex, flags]) {
        this.name = name;
        this.type = type;
        this.min = min ? this.constructor.resolveLimit(min, 'min') : null;
        this.max = max ? this.constructor.resolveLimit(max, 'max') : null;
        this.regex = regexTypes.includes(this.type) && regex ? new RegExp(regex, flags) : null;
        if (regexTypes.includes(this.type) && !this.regex)
            throw 'Regex types must include a regular expression';
    }
    /**
     * Resolves a limit
     * @since 0.2.1
     * @param limit The limit to evaluate
     * @param limitType The type of limit
     */
    static resolveLimit(limit, limitType) {
        const parsed = parseFloat(limit);
        if (Number.isNaN(parsed))
            throw `${limitType} must be a number`;
        return parsed;
    }
}
exports.Possible = Possible;
//# sourceMappingURL=Possible.js.map