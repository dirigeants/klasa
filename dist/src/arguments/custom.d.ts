import { Argument, KlasaMessage, Possible, CustomUsageArgument } from 'klasa';
export default class CoreArgument extends Argument {
    run(argument: string, possible: Possible, message: KlasaMessage, custom: CustomUsageArgument): Promise<unknown>;
}
