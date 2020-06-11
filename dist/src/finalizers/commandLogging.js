"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const klasa_1 = require("klasa");
require("@klasa/dapi-types");
const console_1 = require("@klasa/console");
class default_1 extends klasa_1.Finalizer {
    constructor() {
        super(...arguments);
        this.reprompted = [new console_1.Colors({ background: 'blue' }), new console_1.Colors({ background: 'red' })];
        this.user = new console_1.Colors({ background: 'yellow', text: 'black' });
        this.shard = new console_1.Colors({ background: 'cyan', text: 'black' });
        this.dm = new console_1.Colors({ background: 'magenta' });
        this.text = new console_1.Colors({ background: 'green', text: 'black' });
    }
    run(message, command, _response, timer) {
        const shard = message.guild ? message.guild.shard.id : 0;
        this.client.emit('log', [
            this.shard.format(`[${shard}]`),
            `${command.name}(${message.args ? message.args.join(', ') : ''})`,
            this.reprompted[Number(message.reprompted)].format(`[${timer.stop()}]`),
            this.user.format(`${message.author.username}[${message.author.id}]`),
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            message.channel.type === 1 /* DM */ ? this.dm.format('Direct Messages') : this.text.format(`${message.guild.name}[${message.guild.id}]`)
        ].join(' '));
    }
    init() {
        this.enabled = this.client.options.commands.logging;
    }
}
exports.default = default_1;
//# sourceMappingURL=commandLogging.js.map