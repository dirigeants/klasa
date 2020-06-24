import { Inhibitor, Command } from 'klasa';
import { ChannelType } from '@klasa/dapi-types';

import type { Message } from '@klasa/core';

const GuildTextBasedChannels = [ChannelType.GuildNews, ChannelType.GuildText];

export default class extends Inhibitor {

	public run(message: Message, command: Command): void {
		if (!command.requiredSettings.length || !GuildTextBasedChannels.includes(message.channel.type)) return;
		// eslint-disable-next-line eqeqeq, @typescript-eslint/no-non-null-assertion
		const requiredSettings = command.requiredSettings.filter(setting => message.guild!.settings.get(setting) == null);
		if (requiredSettings.length) throw message.language.get('INHIBITOR_REQUIRED_SETTINGS', requiredSettings);
	}

}
