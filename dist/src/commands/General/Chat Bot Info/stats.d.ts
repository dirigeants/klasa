import { Command, KlasaMessage, CommandStore } from 'klasa';
import type { Message } from '@klasa/core';
export default class extends Command {
    constructor(store: CommandStore, directory: string, files: readonly string[]);
    run(message: KlasaMessage): Promise<Message[]>;
}
