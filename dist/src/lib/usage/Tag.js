"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tag = void 0;
const Possible_1 = require("./Possible");
/**
 * Represents a usage Tag
 */
class Tag {
    /**
     * @since 0.2.1
     * @param members The tag contents to parse
     * @param count The position of the tag in the usage string
     * @param required The type of tag
     */
    constructor(members, count, required) {
        this.required = required;
        this.repeat = false;
        this.possibles = this.constructor.parseMembers(members, count);
        this.response = null;
    }
    /**
     * Registers a response
     * @since 0.5.0
     * @param name The argument name the response is for
     * @param response The custom response
     */
    register(name, response) {
        if (this.response)
            return false;
        if (this.possibles.some(val => val.name === name)) {
            this.response = response;
            return true;
        }
        return false;
    }
    /**
     * Parses members into usable possibles
     * @since 0.2.1
     * @param rawMembers The tag contents to parse
     * @param count The position of the tag in the usage string
     */
    static parseMembers(rawMembers, count) {
        const literals = [];
        const types = [];
        const members = this.parseTrueMembers(rawMembers);
        return members.map((member, i) => {
            const current = `${members.join('|')}: at tag #${count} at bound #${i + 1}`;
            let possible;
            try {
                possible = new Possible_1.Possible(this.pattern.exec(member));
            }
            catch (err) {
                if (typeof err === 'string')
                    throw `${current}: ${err}`;
                throw `${current}: invalid syntax, non specific`;
            }
            if (possible.type === 'literal') {
                if (literals.includes(possible.name))
                    throw `${current}: there can't be two literals with the same text.`;
                literals.push(possible.name);
            }
            else if (members.length > 1) {
                if (['str', 'string'].includes(possible.type) && members.length - 1 !== i)
                    throw `${current}: the String type is vague, you must specify it at the last bound`;
                if (types.includes(possible.type))
                    throw `${current}: there can't be two bounds with the same type (${possible.type})`;
                types.push(possible.type);
            }
            return possible;
        });
    }
    /**
     * Parses raw members true members
     * @since 0.2.1
     * @param members The tag contents to parse
     */
    static parseTrueMembers(members) {
        const trueMembers = [];
        let regex = false;
        let current = '';
        for (const char of members) {
            if (char === '/')
                regex = !regex;
            if (char !== '|' || regex) {
                current += char;
            }
            else {
                trueMembers.push(current);
                current = '';
            }
        }
        trueMembers.push(current);
        return trueMembers;
    }
}
exports.Tag = Tag;
/**
 * Standard regular expressions for matching usage tags
 * @since 0.5.0
 */
Tag.pattern = /^([^:]+)(?::([^{}/]+))?(?:{([^,]+)?,?([^}]+)?})?(?:\/(.+)\/(\w+)?)?$/i;
//# sourceMappingURL=Tag.js.map