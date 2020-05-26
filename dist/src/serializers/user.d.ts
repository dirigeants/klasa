import { Serializer, SerializerUpdateContext } from 'klasa';
import { User } from '@klasa/core';
export default class CoreSerializer extends Serializer {
    deserialize(data: string | User, { language, entry }: SerializerUpdateContext): Promise<User>;
    serialize(value: User): string;
    stringify(value: User): string;
}
