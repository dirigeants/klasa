/// <reference types="node" />
import { Serializer, SerializerUpdateContext } from 'klasa';
import { URL } from 'url';
export default class CoreSerializer extends Serializer {
    deserialize(data: string | URL, { language, entry }: SerializerUpdateContext): string;
}
