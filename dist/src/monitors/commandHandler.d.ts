import { Monitor, MonitorStore, KlasaMessage } from 'klasa';
import { Message } from '@klasa/core';
export default class CommandHandler extends Monitor {
    constructor(store: MonitorStore, directory: string, files: readonly string[]);
    run(message: KlasaMessage): Promise<void | Message[]>;
    private runCommand;
}
