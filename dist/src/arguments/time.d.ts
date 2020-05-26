import { Argument, Possible, KlasaMessage, CustomUsageArgument } from 'klasa';
export default class CoreArgument extends Argument {
    get date(): Argument;
    get duration(): Argument;
    run(argument: string, possible: Possible, message: KlasaMessage, custom: CustomUsageArgument): Date;
}
