import { Argument, Possible, CustomUsageArgument } from 'klasa';
import type { Message } from '@klasa/core';
export default class CoreArgument extends Argument {
    get date(): Argument;
    get duration(): Argument;
    run(argument: string, possible: Possible, message: Message, custom: CustomUsageArgument): Date;
}
