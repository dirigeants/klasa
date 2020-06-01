import { Serializer, SerializerStore, SerializerUpdateContext } from 'klasa';
export default class CoreSerializer extends Serializer {
    constructor(store: SerializerStore, directory: string, file: readonly string[]);
    validate(data: unknown, { entry, language }: SerializerUpdateContext): Promise<boolean>;
    stringify(value: boolean): string;
}
