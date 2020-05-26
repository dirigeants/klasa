import { Inhibitor, Command, KlasaMessage } from 'klasa';
export default class extends Inhibitor {
    run(message: KlasaMessage, command: Command): void;
}
