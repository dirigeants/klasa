import { Serializer, SerializerUpdateContext } from 'klasa';
import { Role } from '@klasa/core';
export default class CoreSerializer extends Serializer {
    validate(data: string | Role, { entry, language, guild }: SerializerUpdateContext): Promise<Role>;
    serialize(value: Role): string;
    stringify(value: Role): string;
}
