import { Argument, ArgumentStore, Possible, KlasaMessage, CustomUsageArgument } from 'klasa';
export default class CoreArgument extends Argument {
    constructor(store: ArgumentStore, directory: string, file: readonly string[]);
    get base(): Argument;
    run(argument: string, possible: Possible, message: KlasaMessage, custom: CustomUsageArgument): string;
}
