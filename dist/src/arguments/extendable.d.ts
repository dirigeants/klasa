import { Argument, Possible, KlasaMessage, Extendable } from 'klasa';
export default class CoreArgument extends Argument {
    run(argument: string, possible: Possible, message: KlasaMessage): Extendable;
}
