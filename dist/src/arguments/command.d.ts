import { Argument, ArgumentStore, Command, KlasaMessage, Possible } from 'klasa';
export default class CoreArgument extends Argument {
    constructor(store: ArgumentStore, directory: string, file: readonly string[]);
    run(argument: string, possible: Possible, message: KlasaMessage): Command;
}
