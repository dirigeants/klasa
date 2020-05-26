import { Inhibitor, KlasaMessage, Command } from 'klasa';
export default class extends Inhibitor {
    private readonly impliedPermissions;
    private readonly friendlyPerms;
    run(message: KlasaMessage, command: Command): void;
}
