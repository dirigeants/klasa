import { Argument, Possible } from 'klasa';
import type { TextChannel, Message } from '@klasa/core';
export default class CoreArgument extends Argument {
    run(argument: string, possible: Possible, message: Message): Promise<TextChannel>;
}
