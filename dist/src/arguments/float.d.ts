import { Argument, ArgumentStore, Possible, KlasaMessage } from 'klasa';
export default class CoreArgument extends Argument {
    constructor(store: ArgumentStore, directory: string, file: readonly string[]);
    run(argument: string, possible: Possible, message: KlasaMessage): number | null;
}
