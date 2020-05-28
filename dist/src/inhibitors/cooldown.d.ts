import { Inhibitor, Command, InhibitorStore } from 'klasa';
import type { Message } from '@klasa/core';
export default class extends Inhibitor {
    constructor(store: InhibitorStore, directory: string, files: readonly string[]);
    run(message: Message, command: Command): void;
}
