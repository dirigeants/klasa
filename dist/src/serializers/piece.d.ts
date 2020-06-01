import { Serializer, SerializerUpdateContext, SerializerStore } from 'klasa';
import type { Piece } from '@klasa/core';
export default class CoreSerializer extends Serializer {
    constructor(store: SerializerStore, directory: string, file: readonly string[]);
    validate(data: string | Piece, { entry, language }: SerializerUpdateContext): Promise<Piece>;
    serialize(value: Piece): string;
    stringify(value: Piece): string;
}
