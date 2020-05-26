import { Command, CommandStore, KlasaMessage } from 'klasa';
import { Message } from '@klasa/core';
export default class extends Command {
    constructor(store: CommandStore, directory: string, files: readonly string[]);
    run(message: KlasaMessage, [code]: string[]): Promise<Message[]>;
    private eval;
    formatTime(syncTime: string, asyncTime: string | undefined): string;
}
