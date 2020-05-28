import { Argument, Possible } from 'klasa';

import type { GuildEmoji, Message } from '@klasa/core';

export default class CoreArgument extends Argument {

	public run(argument: string, possible: Possible, message: Message): GuildEmoji {
		const emojiID = Argument.regex.emoji.exec(argument);
		const emoji = emojiID ? this.client.emojis.get(emojiID[1]) : null;
		if (emoji) return emoji;
		throw message.language.get('RESOLVER_INVALID_EMOJI', possible.name);
	}

}
