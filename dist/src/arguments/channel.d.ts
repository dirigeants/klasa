import { Argument, Possible, KlasaMessage } from 'klasa';
import { Channel } from '@klasa/core';
export default class CoreArgument extends Argument {
    run(argument: string, possible: Possible, message: KlasaMessage): Promise<Channel>;
}
