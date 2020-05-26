import { Serializer, SerializerStore, SerializerUpdateContext } from 'klasa';
export default class CoreSerializer extends Serializer {
    constructor(store: SerializerStore, directory: string, file: readonly string[]);
    deserialize(data: unknown, { language, entry }: SerializerUpdateContext): boolean;
    stringify(value: boolean): string;
}
