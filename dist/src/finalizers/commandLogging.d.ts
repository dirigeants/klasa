import { Finalizer, KlasaMessage, Command } from 'klasa';
import { Stopwatch } from '@klasa/stopwatch';
export default class extends Finalizer {
    private reprompted;
    private user;
    private shard;
    private dm;
    private text;
    run(message: KlasaMessage, command: Command, _response: KlasaMessage[], timer: Stopwatch): void;
    init(): void;
}
