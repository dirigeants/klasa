import { version as klasaVersion, Command, KlasaMessage, CommandStore } from 'klasa';
import { version as discordVersion } from '@klasa/core/package.json';
import { Duration } from '@klasa/duration';
import { codeblock } from 'discord-md-tags';

import type { Message } from '@klasa/core';

export default class extends Command {

	public constructor(store: CommandStore, directory: string, files: readonly string[]) {
		super(store, directory, files, {
			guarded: true,
			description: language => language.get('COMMAND_STATS_DESCRIPTION')
		});
	}

	public async run(message: KlasaMessage): Promise<Message[]> {
		return message.send(mb => mb
			.setContent(codeblock('asciidoc') `${message.language.get('COMMAND_STATS',
				(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2),
				Duration.toNow(Date.now() - (process.uptime() * 1000)),
				this.client.users.size.toLocaleString(),
				this.client.guilds.size.toLocaleString(),
				this.client.channels.size.toLocaleString(),
				klasaVersion, discordVersion, process.version, message
			)}`)
		);
	}

}
