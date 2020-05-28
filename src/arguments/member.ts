import { Argument, Possible } from 'klasa';

import type { GuildMember, Message } from '@klasa/core';

export default class CoreArgument extends Argument {

	public async run(argument: string, possible: Possible, message: Message): Promise<GuildMember> {
		const memberID = Argument.regex.userOrMember.exec(argument);
		const member = memberID ? await message.guild?.members.fetch(memberID[1]).catch(() => null) : null;
		if (member) return member;
		throw message.language.get('RESOLVER_INVALID_MEMBER', possible.name);
	}

}
