import { Serializer, SerializerUpdateContext } from 'klasa';
import { User } from '@klasa/core';

export default class CoreSerializer extends Serializer {

	public async deserialize(data: string | User, { language, entry }: SerializerUpdateContext): Promise<User> {
		let user = this.client.users.resolve(data);
		if (user) return user;

		const resolved = Serializer.regex.userOrMember.exec(data as string);
		if (resolved) user = await this.client.users.fetch(resolved[1]).catch(() => null);
		if (user) return user;
		throw language.get('RESOLVER_INVALID_USER', entry.key);
	}

	public serialize(value: User): string {
		return value.id;
	}

	public stringify(value: User): string {
		return value.tag;
	}

}
