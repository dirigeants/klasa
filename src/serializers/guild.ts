import { Serializer, SerializerUpdateContext } from 'klasa';
import { Guild } from '@klasa/core';

export default class CoreSerializer extends Serializer {

	public async validate(data: string | Guild, { entry, language }: SerializerUpdateContext): Promise<Guild> {
		if (data instanceof Guild) return data;
		const guild = Serializer.regex.snowflake.test(data) ? this.client.guilds.get(data) : null;
		if (guild) return guild;
		throw language.get('RESOLVER_INVALID_GUILD', entry.key);
	}

	public serialize(value: Guild): string {
		return value.id;
	}

	public stringify(value: Guild): string {
		return value.name;
	}

}
