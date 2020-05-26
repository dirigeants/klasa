import { Serializer, SerializerStore, SerializerUpdateContext, SchemaEntry, Language } from 'klasa';
import { GuildBasedChannel, Channel, Channels } from '@klasa/core';
import { ChannelType } from '@klasa/dapi-types';

export default class CoreSerializer extends Serializer {

	public constructor(store: SerializerStore, directory: string, file: readonly string[]) {
		super(store, directory, file, { aliases: ['textchannel', 'voicechannel', 'categorychannel', 'storechannel', 'announcementchannel'] });
	}

	public deserialize(data: string | Channels, { language, entry, guild }: SerializerUpdateContext): Channels {
		if (data instanceof Channel) return this.checkChannel(data, entry, language);

		const parsed = Serializer.regex.channel.exec(data);
		const channel = parsed ? (guild || this.client).channels.get(parsed[1]) : null;
		if (channel) return this.checkChannel(channel as Channels, entry, language);
		throw language.get('RESOLVER_INVALID_CHANNEL', entry.key);
	}

	public serialize(value: GuildBasedChannel): string {
		return value.id;
	}

	public stringify(value: GuildBasedChannel): string {
		return value.name;
	}

	private checkChannel(data: Channels, entry: SchemaEntry, language: Language): Channels {
		if (
			entry.type === 'channel' ||
			(entry.type === 'textchannel' && data.type === ChannelType.GuildText) ||
			(entry.type === 'voicechannel' && data.type === ChannelType.GuildVoice) ||
			(entry.type === 'categorychannel' && data.type === ChannelType.GuildCategory) ||
			(entry.type === 'storechannel' && data.type === ChannelType.GuildStore) ||
			(entry.type === 'announcementchannel' && data.type === ChannelType.GuildAnnouncement)
		) return data;
		throw language.get('RESOLVER_INVALID_CHANNEL', entry.key);
	}

}
