import { Argument, Possible } from 'klasa';
import type { Piece, Message } from '@klasa/core';
export default class CoreArgument extends Argument {
    run(argument: string, possible: Possible, message: Message): Piece;
}
