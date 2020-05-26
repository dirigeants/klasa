import { Argument, ArgumentStore, Possible, KlasaMessage } from 'klasa';
import { Message } from '@klasa/core';
export default class CoreArgument extends Argument {
    constructor(store: ArgumentStore, directory: string, file: readonly string[]);
    run(argument: string, possible: Possible, message: KlasaMessage): Promise<Message>;
}
