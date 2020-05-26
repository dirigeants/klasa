import { Serializer, SerializerStore, SerializerUpdateContext } from 'klasa';
import { GuildBasedChannel, Channels } from '@klasa/core';
export default class CoreSerializer extends Serializer {
    constructor(store: SerializerStore, directory: string, file: readonly string[]);
    deserialize(data: string | Channels, { language, entry, guild }: SerializerUpdateContext): Channels;
    serialize(value: GuildBasedChannel): string;
    stringify(value: GuildBasedChannel): string;
    private checkChannel;
}
