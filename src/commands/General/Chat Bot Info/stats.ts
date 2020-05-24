import { version as klasaVersion, Command, KlasaMessage, CommandStore } from 'klasa';
import { version as discordVersion } from '@klasa/core/package.json';
import { Duration } from '@klasa/duration';

export default class extends Command {

	public constructor(store: CommandStore, directory: string, files: readonly string[]) {
		super(store, directory, files, {
			guarded: true,
			description: language => language.get('COMMAND_STATS_DESCRIPTION')
		});
	}

	public async run(message: KlasaMessage) {
		let [users, guilds, channels, memory] = [0, 0, 0, 0];

		if (this.client.shard) {
			const results = await this.client.shard.broadcastEval(`[this.users.size, this.guilds.size, this.channels.size, (process.memoryUsage().heapUsed / 1024 / 1024)]`);
			for (const result of results) {
				users += result[0];
				guilds += result[1];
				channels += result[2];
				memory += result[3];
			}
		}

		return message.sendCode('asciidoc', message.language.get('COMMAND_STATS',
			(memory || process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2),
			Duration.toNow(Date.now() - (process.uptime() * 1000)),
			(users || this.client.users.size).toLocaleString(),
			(guilds || this.client.guilds.size).toLocaleString(),
			(channels || this.client.channels.size).toLocaleString(),
			klasaVersion, discordVersion, process.version, message
		));
	}

}
