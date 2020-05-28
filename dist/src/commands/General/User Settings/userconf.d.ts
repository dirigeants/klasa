import { Command, CommandStore } from 'klasa';
import type { Message } from '@klasa/core';
export default class extends Command {
    private readonly configurableSchemaKeys;
    constructor(store: CommandStore, directory: string, files: readonly string[]);
    show(message: Message, [key]: [string]): Promise<Message[]>;
    set(message: Message, [key, valueToSet]: [string, string]): Promise<Message[]>;
    remove(message: Message, [key, valueToRemove]: [string, string]): Promise<Message[]>;
    reset(message: Message, [key]: [string]): Promise<Message[]>;
    init(): void;
    private displayFolder;
    private displayEntry;
    private displayEntrySingle;
    private displayEntryMultiple;
    private initFolderConfigurableRecursive;
}
