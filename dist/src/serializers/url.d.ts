/// <reference types="node" />
import { Serializer, SerializerUpdateContext } from 'klasa';
import { URL } from 'url';
export default class CoreSerializer extends Serializer {
    validate(data: string | URL, { entry, language }: SerializerUpdateContext): Promise<string>;
}
