import { Command, CommandStore, KlasaMessage } from 'klasa';
import { Piece, Message } from '@klasa/core';
export default class extends Command {
    constructor(store: CommandStore, directory: string, files: readonly string[]);
    run(message: KlasaMessage, [piece]: [Piece]): Promise<Message[]>;
}
