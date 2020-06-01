import { Serializer, SerializerUpdateContext } from 'klasa';
import type { User } from '@klasa/core';
export default class CoreSerializer extends Serializer {
    validate(data: string | User, { entry, language }: SerializerUpdateContext): Promise<User>;
    serialize(value: User): string;
    stringify(value: User): string;
}
