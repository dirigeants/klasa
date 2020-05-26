import { Argument, Possible, KlasaMessage, Inhibitor } from 'klasa';
export default class CoreArgument extends Argument {
    run(argument: string, possible: Possible, message: KlasaMessage): Inhibitor;
}
