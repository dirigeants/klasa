import { Inhibitor, KlasaMessage, Command } from 'klasa';
export default class extends Inhibitor {
    run(message: KlasaMessage, command: Command): boolean;
}
