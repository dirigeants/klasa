import { Serializer, SerializerUpdateContext } from 'klasa';
import { Role } from '@klasa/core';
export default class CoreSerializer extends Serializer {
    deserialize(data: string | Role, { language, entry, guild }: SerializerUpdateContext): Role;
    serialize(value: Role): string;
    stringify(value: Role): string;
}
