import { Argument, Possible } from 'klasa';
import { Guild, Message } from '@klasa/core';
export default class CoreArgument extends Argument {
    run(argument: string, possible: Possible, message: Message): Guild;
}
