import { Monitor, Stopwatch } from 'klasa';
import { Message } from '@klasa/core';

export default class CommandHandler extends Monitor {

	constructor(...args) {
		super(...args, { ignoreOthers: false });
		this.ignoreEdits = !this.client.options.commandEditing;
	}

	private async run(message: Message): Promise<void | Message[]> {
		if (message.guild && !message.guild.me) await message.guild.members.fetch(this.client.user);
		if (!message.channel.postable) return undefined;
		if (!message.commandText && message.prefix === this.client.mentionPrefix) {
			return message.sendLocale('PREFIX_REMINDER', [message.guildSettings.prefix.length ? message.guildSettings.prefix : undefined]);
		}
		if (!message.commandText) return undefined;
		if (!message.command) return this.client.emit('commandUnknown', message, message.commandText, message.prefix, message.prefixLength);
		this.client.emit('commandRun', message, message.command, message.args);

		return this.runCommand(message);
	}

	private async runCommand(message: Message): Promise<void> {
		const timer = new Stopwatch();
		if (this.client.options.commands.typing) message.channel.typing.start();
		try {
			await this.client.inhibitors.run(message, message.command);
			try {
				await message.prompter.run();
				try {
					const subcommand = message.command.subcommands ? message.params.shift() : undefined;
					const commandRun = subcommand ? message.command[subcommand](message, message.params) : message.command.run(message, message.params);
					timer.stop();
					const response = await commandRun;
					this.client.finalizers.run(message, message.command, response, timer);
					this.client.emit('commandSuccess', message, message.command, message.params, response);
				} catch (error) {
					this.client.emit('commandError', message, message.command, message.params, error);
				}
			} catch (argumentError) {
				this.client.emit('argumentError', message, message.command, message.params, argumentError);
			}
		} catch (response) {
			this.client.emit('commandInhibited', message, message.command, response);
		} finally {
			if (this.client.options.commands.typing) message.channel.typing.stop();
		}
	}

}
