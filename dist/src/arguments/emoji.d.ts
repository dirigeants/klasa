import { Argument, KlasaMessage, Possible } from 'klasa';
import { GuildEmoji } from '@klasa/core';
export default class CoreArgument extends Argument {
    run(argument: string, possible: Possible, message: KlasaMessage): GuildEmoji;
}
