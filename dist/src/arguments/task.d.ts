import { Argument, Possible, KlasaMessage, Task } from 'klasa';
export default class CoreArgument extends Argument {
    run(argument: string, possible: Possible, message: KlasaMessage): Task;
}
