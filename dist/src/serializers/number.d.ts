import { Serializer, SerializerStore, SerializerUpdateContext } from 'klasa';
export default class CoreSerializer extends Serializer {
    constructor(store: SerializerStore, directory: string, file: readonly string[]);
    deserialize(data: string | number, { language, entry }: SerializerUpdateContext): number | null;
}
