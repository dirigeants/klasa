import { Argument, ArgumentStore, Possible, KlasaMessage } from 'klasa';
import { User } from '@klasa/core';
export default class CoreArgument extends Argument {
    constructor(store: ArgumentStore, directory: string, file: readonly string[]);
    run(argument: string, possible: Possible, message: KlasaMessage): Promise<User>;
}
