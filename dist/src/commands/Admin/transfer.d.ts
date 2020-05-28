import { Command, CommandStore } from 'klasa';
import type { Piece, Message } from '@klasa/core';
export default class extends Command {
    constructor(store: CommandStore, directory: string, files: readonly string[]);
    run(message: Message, [piece]: [Piece]): Promise<Message[]>;
}
