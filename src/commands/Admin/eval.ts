import { Command, CommandStore } from 'klasa';
import { inspect } from 'util';
import { Stopwatch } from '@klasa/stopwatch';
import { codeblock } from 'discord-md-tags';
import { Type } from '@klasa/type';
import { isThenable } from '@klasa/utils';

import type { Message } from '@klasa/core';

export default class extends Command {

	public constructor(store: CommandStore, directory: string, files: readonly string[]) {
		super(store, directory, files, {
			aliases: ['ev'],
			permissionLevel: 10,
			guarded: true,
			description: language => language.get('COMMAND_EVAL_DESCRIPTION'),
			extendedHelp: language => language.get('COMMAND_EVAL_EXTENDEDHELP'),
			usage: '<expression:str>'
		});
	}

	public async run(message: Message, [code]: string[]): Promise<Message[]> {
		const { success, result, time, type } = await this.eval(message, code);
		const footer = codeblock('ts')`${type}`;
		const output = message.language.get(success ? 'COMMAND_EVAL_OUTPUT' : 'COMMAND_EVAL_ERROR',
			time, codeblock('js')`${result}`, footer);

		if ('silent' in message.flagArgs) return [];

		// Handle too-long-messages
		if (output.length > 2000) {
			if (message.guild && message.channel.attachable) {
				return message.channel.send(mb => mb
					.setContent(message.language.get('COMMAND_EVAL_SENDFILE', time, footer))
					.addFile({ file: Buffer.from(result), name: 'output.txt' }));
			}
			this.client.emit('log', result);
			return message.replyLocale('COMMAND_EVAL_SENDCONSOLE', [time, footer]);
		}

		// If it's a message that can be sent correctly, send it
		return message.reply(mb => mb.setContent(output));
	}

	// Eval the input
	private async eval(message: Message, code: string): Promise<EvalResults> {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-expect-error
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const msg = message;
		const { flagArgs: flags } = message;
		code = code.replace(/[“”]/g, '"').replace(/[‘’]/g, "'");
		const stopwatch = new Stopwatch();
		let success, syncTime, asyncTime, result;
		let thenable = false;
		let type;
		try {
			if (flags.async) code = `(async () => {\n${code}\n})();`;
			result = eval(code);
			syncTime = stopwatch.toString();
			type = new Type(result);
			if (isThenable(result)) {
				thenable = true;
				stopwatch.restart();
				result = await result;
				asyncTime = stopwatch.toString();
			}
			success = true;
		} catch (error) {
			if (!syncTime) syncTime = stopwatch.toString();
			if (!type) type = new Type(error);
			if (thenable && !asyncTime) asyncTime = stopwatch.toString();
			if (error && error.stack) this.client.emit('error', error.stack);
			result = error;
			success = false;
		}

		stopwatch.stop();
		if (typeof result !== 'string') {
			result = inspect(result, {
				depth: flags.depth ? parseInt(flags.depth) || 0 : 0,
				showHidden: Boolean(flags.showHidden)
			});
		}
		return { success, type, time: this.formatTime(syncTime, asyncTime), result };
	}

	public formatTime(syncTime: string, asyncTime: string | undefined): string {
		return asyncTime ? `⏱ ${asyncTime}<${syncTime}>` : `⏱ ${syncTime}`;
	}

}

interface EvalResults {
	success: boolean;
	type: Type;
	time: string;
	result: string;
}
