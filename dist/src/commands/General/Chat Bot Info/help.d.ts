import { Command, CommandStore } from 'klasa';
import type { Message } from '@klasa/core';
export default class extends Command {
    constructor(store: CommandStore, directory: string, files: string[]);
    run(message: Message, [command]: [Command]): Promise<Message[]>;
    private buildHelp;
}
