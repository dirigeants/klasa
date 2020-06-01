import { Serializer, SerializerUpdateContext } from 'klasa';
import { Guild } from '@klasa/core';
export default class CoreSerializer extends Serializer {
    validate(data: string | Guild, { entry, language }: SerializerUpdateContext): Promise<Guild>;
    serialize(value: Guild): string;
    stringify(value: Guild): string;
}
