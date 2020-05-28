import { TextPrompt, TextPromptOptions } from './TextPrompt';

import type { Message } from '@klasa/core';
import type { CommandUsage } from './CommandUsage';

/**
 * A class to handle argument collection and parameter resolution for commands
 * @extends TextPrompt
 */
export class CommandPrompt extends TextPrompt {

	/**
	 * @since 0.5.0
	 * @param message The message for the command
	 * @param usage The usage of the command
	 * @param options The options for this CommandPrompt
	 */
	public constructor(message: Message, usage: CommandUsage, options: TextPromptOptions = {}) {
		super(message, usage, options);
		this.typing = this.client.options.commands.typing;
		// eslint-disable-next-line dot-notation
		this['_setup'](this.message.content.slice(this.message.prefixLength ?? undefined).trim().split(' ').slice(1).join(' ').trim());
	}

	/**
	 * Runs the internal validation, and re-prompts according to the settings
	 * @since 0.5.0
	 * @returns The parameters resolved
	 */
	public run(): Promise<unknown[]> {
		return this.validateArgs();
	}

}
