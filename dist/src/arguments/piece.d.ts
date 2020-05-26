import { Argument, Possible, KlasaMessage } from 'klasa';
import { Piece } from '@klasa/core';
export default class CoreArgument extends Argument {
    run(argument: string, possible: Possible, message: KlasaMessage): Piece;
}
