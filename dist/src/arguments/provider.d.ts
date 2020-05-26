import { Argument, Possible, KlasaMessage, Provider } from 'klasa';
export default class CoreArgument extends Argument {
    run(argument: string, possible: Possible, message: KlasaMessage): Provider;
}
