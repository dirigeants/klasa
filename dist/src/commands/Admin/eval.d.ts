import { Command, CommandStore } from 'klasa';
import type { Message } from '@klasa/core';
export default class extends Command {
    constructor(store: CommandStore, directory: string, files: readonly string[]);
    run(message: Message, [code]: string[]): Promise<Message[]>;
    private eval;
    formatTime(syncTime: string, asyncTime: string | undefined): string;
}
