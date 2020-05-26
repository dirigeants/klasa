import { Argument, Language, Possible, KlasaMessage } from 'klasa';
export default class CoreArgument extends Argument {
    run(argument: string, possible: Possible, message: KlasaMessage): Language;
}
