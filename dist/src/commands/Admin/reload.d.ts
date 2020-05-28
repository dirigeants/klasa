import { Command, CommandStore } from 'klasa';
import { Piece, Store, Message } from '@klasa/core';
export default class extends Command {
    constructor(store: CommandStore, directory: string, files: readonly string[]);
    run(message: Message, [piece]: [Piece | Store<Piece> | 'everything']): Promise<Message[]>;
    everything(message: Message): Promise<Message[]>;
}
