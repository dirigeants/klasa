import { Argument, Possible, Provider } from 'klasa';
import type { Message } from '@klasa/core';
export default class CoreArgument extends Argument {
    run(argument: string, possible: Possible, message: Message): Provider;
}
