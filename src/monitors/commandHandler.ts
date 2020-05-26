import { Command, Monitor, MonitorStore, KlasaMessage, CommandPrompt } from 'klasa';
import { Message, ClientUser } from '@klasa/core';
import { Stopwatch } from '@klasa/stopwatch';

export default class CommandHandler extends Monitor {

	public constructor(store: MonitorStore, directory: string, files: readonly string[]) {
		super(store, directory, files, { ignoreOthers: false });
		this.ignoreEdits = !this.client.options.commands.editing;
	}

	public async run(message: KlasaMessage): Promise<void | Message[]> {
		if (message.guild && !message.guild.me) await message.guild.members.fetch((this.client.user as ClientUser).id);
		if (!message.channel.postable) return undefined;
		if (!message.commandText && message.prefix === this.client.mentionPrefix) {
			const prefix = message.guildSettings.get('prefix') as string | string[];
			return message.sendLocale('PREFIX_REMINDER', [prefix.length ? prefix : undefined]);
		}
		if (!message.commandText) return undefined;
		if (!message.command) {
			this.client.emit('commandUnknown', message, message.commandText, message.prefix, message.prefixLength);
			return undefined;
		}
		this.client.emit('commandRun', message, message.command, message.args);

		return this.runCommand(message);
	}

	private async runCommand(message: KlasaMessage): Promise<void> {
		const timer = new Stopwatch();
		if (this.client.options.commands.typing) message.channel.typing.start();
		try {
			const command = message.command as Command;
			await this.client.inhibitors.run(message, command);
			try {
				// eslint-disable-next-line dot-notation
				await (message['prompter'] as CommandPrompt).run();
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
					this.client.emit('commandSuccess', message, command, message.params, response);
				} catch (error) {
					this.client.emit('commandError', message, command, message.params, error);
				}
			} catch (argumentError) {
				this.client.emit('argumentError', message, command, message.params, argumentError);
			}
		} catch (response) {
			this.client.emit('commandInhibited', message, message.command, response);
		} finally {
			if (this.client.options.commands.typing) message.channel.typing.stop();
		}
	}

}
