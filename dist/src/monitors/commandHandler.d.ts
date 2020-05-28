import { Monitor, MonitorStore } from 'klasa';
import type { Message } from '@klasa/core';
export default class CommandHandler extends Monitor {
    constructor(store: MonitorStore, directory: string, files: readonly string[]);
    run(message: Message): Promise<void | Message[]>;
    private runCommand;
}
