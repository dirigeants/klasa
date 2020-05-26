import { Argument, Possible, KlasaMessage } from 'klasa';
import { GuildMember } from '@klasa/core';
export default class CoreArgument extends Argument {
    run(argument: string, possible: Possible, message: KlasaMessage): Promise<GuildMember>;
}
