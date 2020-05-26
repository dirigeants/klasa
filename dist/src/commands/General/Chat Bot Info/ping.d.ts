import { Command, KlasaMessage, CommandStore } from 'klasa';
import { Message } from '@klasa/core';
export default class extends Command {
    constructor(store: CommandStore, directory: string, files: string[]);
    run(message: KlasaMessage): Promise<Message[]>;
}
