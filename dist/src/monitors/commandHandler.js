"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const klasa_1 = require("klasa");
const stopwatch_1 = require("@klasa/stopwatch");
class CommandHandler extends klasa_1.Monitor {
    constructor(store, directory, files) {
        super(store, directory, files, { ignoreOthers: false });
        this.ignoreEdits = !this.client.options.commands.editing;
    }
    async run(message) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        if (message.guild && !message.guild.me)
            await message.guild.members.fetch(this.client.user.id);
        if (!message.channel.postable)
            return undefined;
        if (!message.commandText && message.prefix === this.client.mentionPrefix) {
            const prefix = message.guildSettings.get('prefix');
            return message.sendLocale('PREFIX_REMINDER', [prefix.length ? prefix : undefined]);
        }
        if (!message.commandText)
            return undefined;
        if (!message.command) {
            this.client.emit('commandUnknown', message, message.commandText, message.prefix, message.prefixLength);
            return undefined;
        }
        this.client.emit('commandRun', message, message.command, message.args);
        return this.runCommand(message);
    }
    async runCommand(message) {
        const timer = new stopwatch_1.Stopwatch();
        if (this.client.options.commands.typing)
            message.channel.typing.start();
        let token = null;
        try {
            const command = message.command;
            if (!this.client.owners.has(message.author) && command.cooldowns.time) {
                const ratelimit = command.cooldowns.acquire(message.guild ? Reflect.get(message, command.cooldownLevel).id : message.author.id);
                if (ratelimit.limited)
                    throw message.language.get('INHIBITOR_COOLDOWN', Math.ceil(ratelimit.remainingTime / 1000), command.cooldownLevel !== 'author');
                token = ratelimit.take();
            }
            await this.client.inhibitors.run(message, command);
            try {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                await message.prompter.run();
                try {
                    // Obtain the sub-command name, defaulting to 'run', then retrieve it, check whether or not it's a
                    // function, and when true, call apply on it with the command context and the arguments.
                    const subCommandName = command.subcommands ? message.params.shift() : 'run';
                    const subCommandMethod = Reflect.get(command, subCommandName);
                    if (typeof subCommandMethod !== 'function')
                        throw new TypeError(`The sub-command ${subCommandName} does not exist for ${command.name}.`);
                    const result = Reflect.apply(subCommandMethod, command, [message, message.params]);
                    timer.stop();
                    const response = await result;
                    this.client.finalizers.run(message, command, response, timer);
                    if (token)
                        token.resolve();
                    this.client.emit('commandSuccess', message, command, message.params, response);
                }
                catch (error) {
                    if (token)
                        token.reject();
                    this.client.emit('commandError', message, command, message.params, error);
                }
            }
            catch (argumentError) {
                if (token)
                    token.reject();
                this.client.emit('argumentError', message, command, message.params, argumentError);
            }
        }
        catch (response) {
            if (token)
                token.reject();
            this.client.emit('commandInhibited', message, message.command, response);
        }
        finally {
            if (this.client.options.commands.typing)
                message.channel.typing.stop();
        }
    }
}
exports.default = CommandHandler;
//# sourceMappingURL=commandHandler.js.map