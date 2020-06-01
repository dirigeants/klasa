import { Serializer, SerializerStore, SerializerUpdateContext } from 'klasa';
export default class CoreSerializer extends Serializer {
    constructor(store: SerializerStore, directory: string, file: readonly string[]);
    validate(data: string | number, { entry, language }: SerializerUpdateContext): Promise<number | null>;
}
