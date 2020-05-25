import { Event } from '@klasa/core';
import { codeblock } from 'discord-md-tags';
import type { KlasaMessage, Command } from 'klasa';

export default class extends Event {

	public run(message: KlasaMessage, command: Command, _params: readonly unknown[], error: Error | string): void {
		if (error instanceof Error) this.client.emit('wtf', `[COMMAND] ${command.path}\n${error.stack || error}`);
		if (typeof error === 'string') message.send(mb => mb.setContent(error)).catch(err => this.client.emit('wtf', err));
		else message.send(mb => mb.setContent(codeblock('JSON') `${error.message}`)).catch(err => this.client.emit('wtf', err));
	}

}
