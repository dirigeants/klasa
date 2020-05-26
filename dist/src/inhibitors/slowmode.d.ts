import { Inhibitor, KlasaMessage, InhibitorStore } from 'klasa';
export default class extends Inhibitor {
    private readonly slowmode;
    private readonly aggressive;
    constructor(store: InhibitorStore, directory: string, files: readonly string[]);
    run(message: KlasaMessage): void;
}
