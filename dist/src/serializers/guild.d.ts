import { Serializer, SerializerUpdateContext } from 'klasa';
import { Guild } from '@klasa/core';
export default class CoreSerializer extends Serializer {
    deserialize(data: string | Guild, { language, entry }: SerializerUpdateContext): Guild;
    serialize(value: Guild): string;
    stringify(value: Guild): string;
}
