import { Inhibitor, KlasaMessage, Command, InhibitorStore } from 'klasa';
export default class extends Inhibitor {
    constructor(store: InhibitorStore, directory: string, files: readonly string[]);
    run(message: KlasaMessage, command: Command): void;
}
