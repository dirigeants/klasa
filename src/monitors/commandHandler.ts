import { Command, Monitor, MonitorStore } from 'klasa';
import { Stopwatch } from '@klasa/stopwatch';

import type { Message } from '@klasa/core';
import type { RateLimitToken } from '@klasa/ratelimits';

export default class CommandHandler extends Monitor {

	public constructor(store: MonitorStore, directory: string, files: readonly string[]) {
		super(store, directory, files, { ignoreOthers: false });
		this.ignoreEdits = !this.client.options.commands.editing;
	}

	public async run(message: Message): Promise<void | Message[]> {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		if (message.guild && !message.guild.me) await message.guild.members.fetch(this.client.user!.id);
		if (!message.channel.postable || (!message.commandText && !message.prefix)) return undefined;
		await Promise.all([message.guildSettings.sync(), message.author.settings.sync()]);
		if (!message.commandText && message.prefix === this.client.mentionPrefix) {
			const prefix = message.guildSettings.get('prefix') as string | string[];
			return message.replyLocale('PREFIX_REMINDER', [prefix.length ? prefix : undefined]);
		}
		if (!message.commandText) return undefined;
		if (!message.command) {
			this.client.emit('commandUnknown', message, message.commandText, message.prefix, message.prefixLength);
			return undefined;
		}
		this.client.emit('commandRun', message, message.command, message.args);

		return this.runCommand(message);
	}

	private async runCommand(message: Message): Promise<void> {
		const timer = new Stopwatch();
		if (this.client.options.commands.typing) message.channel.typing.start();
		let token: RateLimitToken | null = null;
		try {
			const command = message.command as Command;

			if (!this.client.owners.has(message.author) && command.cooldowns.time) {
				const ratelimit = command.cooldowns.acquire(message.guild ? Reflect.get(message, command.cooldownLevel).id : message.author.id);
				if (ratelimit.limited) throw message.language.get('INHIBITOR_COOLDOWN', Math.ceil(ratelimit.remainingTime / 1000), command.cooldownLevel !== 'author');
				token = ratelimit.take();
			}

			await this.client.inhibitors.run(message, command);
			try {
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				await message.prompter!.run();
				try {
					// Obtain the sub-command name, defaulting to 'run', then retrieve it, check whether or not it's a
					// function, and when true, call apply on it with the command context and the arguments.
					const subCommandName = command.subcommands ? message.params.shift() as string : 'run';
					const subCommandMethod = Reflect.get(command, subCommandName);
					if (typeof subCommandMethod !== 'function') throw new TypeError(`The sub-command ${subCommandName} does not exist for ${command.name}.`);

					const result = Reflect.apply(subCommandMethod, command, [message, message.params]);
					timer.stop();
					const response = await result;

					this.client.finalizers.run(message, command, response, timer);

					if (token) token.commit();
					this.client.emit('commandSuccess', message, command, message.params, response);
				} catch (error) {
					if (token) token.revert();
					this.client.emit('commandError', message, command, message.params, error);
				}
			} catch (argumentError) {
				if (token) token.revert();
				this.client.emit('argumentError', message, command, message.params, argumentError);
			}
		} catch (response) {
			if (token) token.revert();
			this.client.emit('commandInhibited', message, message.command, response);
		} finally {
			if (this.client.options.commands.typing) message.channel.typing.stop();
		}
	}

}
