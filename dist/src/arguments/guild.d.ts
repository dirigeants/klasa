import { Argument, KlasaMessage, Possible } from 'klasa';
import { Guild } from '@klasa/core';
export default class CoreArgument extends Argument {
    run(argument: string, possible: Possible, message: KlasaMessage): Guild;
}
