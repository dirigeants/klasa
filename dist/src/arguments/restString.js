"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const klasa_1 = require("klasa");
class CoreArgument extends klasa_1.Argument {
    constructor(store, directory, file) {
        super(store, directory, file, { name: '...string', aliases: ['...str'] });
    }
    get base() {
        return this.store.get('string');
    }
    run(argument, possible, message, custom) {
        if (!argument)
            throw message.language.get('RESOLVER_INVALID_STRING', possible.name);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const { args, usage: { usageDelim } } = message.prompter;
        const index = args.indexOf(argument);
        const rest = args.splice(index, args.length - index).join(usageDelim);
        args.push(rest);
        return this.base.run(rest, possible, message, custom);
    }
}
exports.default = CoreArgument;
//# sourceMappingURL=restString.js.map