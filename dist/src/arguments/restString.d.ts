import { Argument, ArgumentStore, Possible, CustomUsageArgument } from 'klasa';
import type { Message } from '@klasa/core';
export default class CoreArgument extends Argument {
    constructor(store: ArgumentStore, directory: string, file: readonly string[]);
    get base(): Argument;
    run(argument: string, possible: Possible, message: Message, custom: CustomUsageArgument): string;
}
