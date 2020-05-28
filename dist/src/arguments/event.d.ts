import { Argument, Possible } from 'klasa';
import type { Event, Message } from '@klasa/core';
export default class CoreArgument extends Argument {
    run(argument: string, possible: Possible, message: Message): Event;
}
