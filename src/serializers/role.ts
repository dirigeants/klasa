import { Serializer, SerializerUpdateContext } from 'klasa';
import { Role } from '@klasa/core';

export default class CoreSerializer extends Serializer {

	public async validate(data: string | Role, { entry, language, guild }: SerializerUpdateContext): Promise<Role> {
		if (!guild) throw this.client.languages.default.get('RESOLVER_INVALID_GUILD', entry.key);
		if (data instanceof Role) return data;

		const parsed = Serializer.regex.role.exec(data);
		const role = parsed ? guild.roles.get(parsed[1]) : guild.roles.findValue(value => value.name === data) || null;
		if (role) return role;
		throw language.get('RESOLVER_INVALID_ROLE', entry.key);
	}

	public serialize(value: Role): string {
		return value.id;
	}

	public stringify(value: Role): string {
		return value.name;
	}

}
