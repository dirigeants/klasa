import { Inhibitor, InhibitorStore } from 'klasa';
import type { Message } from '@klasa/core';
export default class extends Inhibitor {
    private readonly slowmode;
    private readonly aggressive;
    constructor(store: InhibitorStore, directory: string, files: readonly string[]);
    run(message: Message): void;
}
