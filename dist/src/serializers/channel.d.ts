import { Serializer, SerializerStore, SerializerUpdateContext } from 'klasa';
import { GuildBasedChannel, Channels } from '@klasa/core';
export default class CoreSerializer extends Serializer {
    constructor(store: SerializerStore, directory: string, file: readonly string[]);
    validate(data: string | Channels, { entry, language, guild }: SerializerUpdateContext): Promise<Channels>;
    serialize(value: GuildBasedChannel): string;
    stringify(value: GuildBasedChannel): string;
    private checkChannel;
}
