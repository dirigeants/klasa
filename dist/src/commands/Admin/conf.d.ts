import { Command, CommandStore } from 'klasa';
import type { Message } from '@klasa/core';
export default class extends Command {
    constructor(store: CommandStore, directory: string, files: readonly string[]);
    private get gateway();
    show(message: Message, [key]: [string]): Promise<Message[]>;
    set(message: Message, [key, valueToSet]: [string, string]): Promise<Message[]>;
    remove(message: Message, [key, valueToRemove]: [string, string]): Promise<Message[]>;
    reset(message: Message, [key]: [string]): Promise<Message[]>;
    private displayFolder;
    private displayEntry;
    private displayEntrySingle;
    private displayEntryMultiple;
}
