import { Argument, KlasaMessage, Possible } from 'klasa';
export default class CoreArgument extends Argument {
    run(argument: string, possible: Possible, message: KlasaMessage): Argument;
}
