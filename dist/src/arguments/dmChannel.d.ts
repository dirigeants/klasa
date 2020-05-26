import { Argument, Possible, KlasaMessage } from 'klasa';
import type { DMChannel } from '@klasa/core';
export default class CoreArgument extends Argument {
    run(argument: string, possible: Possible, message: KlasaMessage): Promise<DMChannel>;
}
