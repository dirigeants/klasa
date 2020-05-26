import { Argument, Possible, KlasaMessage, Monitor } from 'klasa';
export default class CoreArgument extends Argument {
    run(argument: string, possible: Possible, message: KlasaMessage): Monitor;
}
