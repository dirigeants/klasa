import { Usage } from './Usage';
import { CommandPrompt } from './CommandPrompt';
import { KlasaClient } from '../Client';
import { Command } from '../structures/Command';
import { KlasaMessage } from '../extensions/KlasaMessage';
import { TextPromptOptions } from './TextPrompt';

/**
 * Converts usage strings into objects to compare against later
 */
export class CommandUsage extends Usage {

	/**
	 * All names and aliases for the command
	 * @since 0.0.1
	 */
	public names: string[];

	/**
	 * The compiled string for all names/aliases in a usage string
	 * @since 0.0.1
	 */
	public commands: string;

	/**
	 * The concatenated string of this.commands and this.deliminatedUsage
	 * @since 0.0.1
	 */
	public nearlyFullUsage: string;

	/**
	 * @since 0.0.1
	 * @param client The klasa client
	 * @param usageString The usage string for this command
	 * @param usageDelim The usage deliminator for this command
	 * @param command The command this parsed usage is for
	 */
	public constructor(client: KlasaClient, usageString: string, usageDelim: string, command: Command) {
		super(client, usageString, usageDelim);
		this.names = [command.name, ...command.aliases];
		this.commands = this.names.length === 1 ? this.names[0] : `《${this.names.join('|')}》`;
		this.nearlyFullUsage = `${this.commands}${this.deliminatedUsage}`;
	}

	/**
	 * Creates a CommandPrompt instance to collect and resolve arguments with
	 * @since 0.5.0
	 * @param message The message context from the prompt
	 * @param options The options for the prompt
	 */
	public createPrompt(message: KlasaMessage, options: TextPromptOptions = {}): CommandPrompt {
		return new CommandPrompt(message, this, options);
	}

	/**
	 * Creates a full usage string including prefix and commands/aliases for documentation/help purposes
	 * @since 0.0.1
	 * @param message The message context for which to generate usage for
	 */
	public fullUsage(message: KlasaMessage): string {
		let prefix = message.prefixLength ? message.content.slice(0, message.prefixLength) : message.guildSettings.prefix;
		if (message.prefix === this.client.mentionPrefix) prefix = `@${this.client.user.tag}`;
		else if (Array.isArray(prefix)) [prefix] = prefix;
		return `${prefix.length !== 1 ? `${prefix} ` : prefix}${this.nearlyFullUsage}`;
	}

	/**
	 * Defines to string behavior of this class.
	 * @since 0.5.0
	 */
	public toString(): string {
		return this.nearlyFullUsage;
	}

}
