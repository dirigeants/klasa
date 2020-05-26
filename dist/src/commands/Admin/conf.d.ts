import { Command, CommandStore, KlasaMessage } from 'klasa';
import { Message } from '@klasa/core';
export default class extends Command {
    private readonly configurableSchemaKeys;
    constructor(store: CommandStore, directory: string, files: readonly string[]);
    show(message: KlasaMessage, [key]: [string]): Promise<Message[]>;
    set(message: KlasaMessage, [key, valueToSet]: [string, string]): Promise<Message[]>;
    remove(message: KlasaMessage, [key, valueToRemove]: [string, string]): Promise<Message[]>;
    reset(message: KlasaMessage, [key]: [string]): Promise<Message[]>;
    init(): void;
    private displayFolder;
    private displayEntry;
    private displayEntrySingle;
    private displayEntryMultiple;
    private initFolderConfigurableRecursive;
}
