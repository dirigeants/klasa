import { Command, CommandStore } from 'klasa';
import type { Message, Store, Piece } from '@klasa/core';
export default class extends Command {
    private readonly regExp;
    constructor(store: CommandStore, directory: string, files: readonly string[]);
    run(message: Message, [core, store, rawPath]: [string, Store<Piece>, string]): Promise<Message[]>;
    private tryEach;
}
